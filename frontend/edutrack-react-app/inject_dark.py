import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    
    # Simple dictionary of replacements. We only replace if the dark: counterpart doesn't already exist in the same class string.
    # We will use a regex that finds class="...", className="..." or className={`...`} and injects dark classes.
    
    def replace_classes(match):
        full_match = match.group(0)
        class_content = match.group(2)
        
        # Split by spaces to evaluate individual classes, but keep the original string to replace safely
        classes = class_content.split()
        
        new_classes = class_content
        
        # Mapping of base classes to their dark counterparts
        mappings = {
            'bg-white': 'dark:bg-slate-900',
            'bg-slate-50': 'dark:bg-slate-900/50',
            'bg-slate-100': 'dark:bg-slate-800',
            'text-slate-900': 'dark:text-white',
            'text-slate-800': 'dark:text-slate-200',
            'text-slate-700': 'dark:text-slate-300',
            'text-slate-600': 'dark:text-slate-400',
            'text-slate-500': 'dark:text-slate-400',
            'border-slate-200': 'dark:border-slate-800',
            'border-slate-100': 'dark:border-slate-800',
            'border-slate-300': 'dark:border-slate-700',
            'hover:bg-slate-50': 'dark:hover:bg-slate-800',
            'hover:bg-slate-100': 'dark:hover:bg-slate-800',
        }
        
        for base_cls, dark_cls in mappings.items():
            # If base class exists and its dark counterpart does NOT exist
            if base_cls in classes and dark_cls not in classes:
                # Also ensure we aren't duplicating if another dark version exists for the same property
                # e.g. if we have bg-white but also dark:bg-slate-950, we shouldn't add dark:bg-slate-900
                prop_prefix = dark_cls.split(':')[1].split('-')[0] # e.g. 'bg', 'text', 'border'
                # actually it's easier to just check if `dark:` + prop_prefix exists
                has_dark_prop = any(c.startswith(f"dark:{prop_prefix}") for c in classes)
                if not has_dark_prop:
                    # append the dark class
                    new_classes += f" {dark_cls}"
                    classes.append(dark_cls)
                    
        return full_match.replace(class_content, new_classes)

    # Match className="...", className='...', className={`...`}
    # Regex explanation: className=(["'`]|{`)(.*?)(["'`]|`})
    # We need to be careful with dynamic classes. 
    # Let's just do a simpler string replacement for common patterns to avoid breaking JSX.
    
    # Actually, a safer approach is to replace whole tokens, but only inside className
    # Or just replace the string globally if it's safe.
    # Is it safe to globally replace 'bg-white' with 'bg-white dark:bg-slate-900'?
    # Only if 'bg-white' isn't already followed by 'dark:bg-' something.
    
    # Let's just do global regex replace for safety on spaces
    replacements = [
        (r'\bbg-white\b(?!.*dark:bg-)', r'bg-white dark:bg-slate-900'),
        (r'\bbg-slate-50\b(?!.*dark:bg-)', r'bg-slate-50 dark:bg-slate-900/50'),
        (r'\bbg-slate-100\b(?!.*dark:bg-)', r'bg-slate-100 dark:bg-slate-800'),
        (r'\btext-slate-900\b(?!.*dark:text-)', r'text-slate-900 dark:text-white'),
        (r'\btext-slate-800\b(?!.*dark:text-)', r'text-slate-800 dark:text-slate-200'),
        (r'\btext-slate-700\b(?!.*dark:text-)', r'text-slate-700 dark:text-slate-300'),
        (r'\btext-slate-600\b(?!.*dark:text-)', r'text-slate-600 dark:text-slate-400'),
        (r'\btext-slate-500\b(?!.*dark:text-)', r'text-slate-500 dark:text-slate-400'),
        (r'\bborder-slate-200\b(?!.*dark:border-)', r'border-slate-200 dark:border-slate-800'),
        (r'\bborder-slate-100\b(?!.*dark:border-)', r'border-slate-100 dark:border-slate-800'),
        (r'\bhover:bg-slate-50\b(?!.*dark:hover:bg-)', r'hover:bg-slate-50 dark:hover:bg-slate-800/50'),
        (r'\bhover:bg-slate-100\b(?!.*dark:hover:bg-)', r'hover:bg-slate-100 dark:hover:bg-slate-800'),
    ]
    
    # We need to process line by line to keep the negative lookahead bound to the line/class string
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if 'className' in line or 'class=' in line or '`' in line or '"' in line or "'" in line:
            for pattern, repl in replacements:
                # We want to replace if the dark version isn't already there.
                # A simple regex: if bg-white is found, and dark:bg-slate-900 is NOT in the line, replace it.
                # This is safer.
                base_cls = pattern.split(r'\b')[1].split(r'\b')[0]
                dark_cls = repl.split(' ')[1]
                if base_cls in line and dark_cls not in line:
                    # Also check if another dark:bg- is present right after
                    # It's easiest to just replace it directly if dark_cls isn't in line
                    # But wait, what if `dark:bg-slate-950` is in the line?
                    prop = dark_cls.split('-')[0] + '-' # 'dark:bg-'
                    if prop not in line or base_cls == 'border-slate-200': # allow multiple borders?
                         # just use a simple string replace if base_cls is not part of another word
                         line = re.sub(r'\b' + base_cls + r'\b(?!/|-) *(?!dark:)', base_cls + ' ' + dark_cls + ' ', line)
                         # clean up extra spaces
                         line = line.replace('  ', ' ')
        new_lines.append(line)
        
    new_content = '\n'.join(new_lines)
    
    if new_content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    src_dir = r"D:\eduTrack_structure\EduTrack\frontend\edutrack-react-app\src"
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.jsx', '.js', '.tsx')):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
