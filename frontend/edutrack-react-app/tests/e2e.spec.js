import { test, expect } from '@playwright/test';

// Use a timestamp to ensure unique users for each test run
const timestamp = Date.now();
const studentEmail = `student${timestamp}@test.com`;
const facultyEmail = 'faculty@test.com'; // We'll use the existing faculty account
const adminEmail = 'admin@test.com';
const employerEmail = 'employer@test.com';
const password = 'testpassword123';

test.describe('EduTrack E2E Workflow', () => {

  test('1. Student Registration', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[placeholder="Enter your full name"]', `Student ${timestamp}`);
    await page.fill('input[type="email"]', studentEmail);
    await page.fill('input[placeholder="Minimum 8 characters"]', password);
    await page.fill('input[placeholder="Re-enter your password"]', password);
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard on success
    await expect(page).toHaveURL(/.*\/student\/dashboard/);
  });

  test('2. Student Login and 3. Dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', studentEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/student\/dashboard/);
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('4. Certificate Upload & 5. Achievement Creation', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', studentEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/student\/dashboard/);

    await page.goto('/student/add-achievement');
    await page.fill('input[placeholder="Enter activity title"]', `Test Activity ${timestamp}`);
    await page.fill('input[placeholder="Workshop / Sports / Research / Certification"]', 'Technical');
    await page.fill('textarea', 'Completed a challenging project.');
    await page.fill('input[type="date"]', '2025-12-01');
    
    // We mock file upload by creating a small text file buffer masquerading as a valid upload, 
    // or we can use a small dummy file in the tests directory. 
    // Wait, let's create a dummy file on disk for the test.
    const fs = require('fs');
    fs.writeFileSync('test-cert.txt', 'dummy certificate content');
    
    await page.setInputFiles('input[type="file"]', 'test-cert.txt');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to My Activities or show success
    await page.goto('/student/my-activities');
    await expect(page.locator(`text=Test Activity ${timestamp}`)).toBeVisible();
    await expect(page.locator('text=Pending')).toBeVisible();
  });

  test('6. Faculty Login & 7. Pending Verification', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', facultyEmail);
    // Note: Assuming faculty@test.com / test@123 exists from previous setup.
    await page.fill('input[type="password"]', 'test@123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/faculty\/dashboard/);
    
    await page.goto('/faculty/pending-verification');
    await expect(page.locator(`text=Test Activity ${timestamp}`)).toBeVisible();
  });

  test('8. Faculty View Certificate & 9. Approve', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', facultyEmail);
    await page.fill('input[type="password"]', 'test@123');
    await page.click('button[type="submit"]');
    await page.goto('/faculty/pending-verification');

    // Assume there is a View Certificate button for the item
    // Instead of clicking which opens new tab, we just verify it exists
    await expect(page.locator('button:has-text("View Certificate")').first()).toBeVisible();
    
    // Click Approve
    const approveBtn = page.locator('button:has-text("Approve")').first();
    await approveBtn.click();
    
    // Wait for it to disappear from pending
    await expect(page.locator(`text=Test Activity ${timestamp}`)).not.toBeVisible();
  });

  test('10. Student sees updated status & 11. AI Score & 12. PDF Report', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', studentEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    await page.goto('/student/my-activities');
    await expect(page.locator(`text=Test Activity ${timestamp}`).first()).toBeVisible();
    await expect(page.locator('text=Verified').first()).toBeVisible();

    // Check AI score
    await page.goto('/student/ai-score');
    await expect(page.locator('text=Your AI Evaluation')).toBeVisible();
    await expect(page.locator('text=Overall Score')).toBeVisible();

    // Check PDF report
    await page.goto('/student/reports');
    // Button exists
    await expect(page.locator('button:has-text("Download My Activity Report")')).toBeVisible();
  });

  test('13. Admin Login & 14. Admin Dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', 'test@123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
    await expect(page.locator('text=Platform Overview')).toBeVisible();
  });

  test('15. Employer Login & 16. Verified Student Flow', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', employerEmail);
    await page.fill('input[type="password"]', 'test@123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/employer\/verify-student/);
    
    // Search for student
    await page.fill('input[placeholder="Enter student email or name"]', studentEmail);
    await page.click('button:has-text("Search")');
    
    // Should see student profile
    await expect(page.locator(`text=${studentEmail}`).first()).toBeVisible();
    await expect(page.locator('text=Verified Activities')).toBeVisible();
  });

  test('17. Authorization Failure for Unauthorized Role', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', studentEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    // Student trying to access admin dashboard
    await page.goto('/admin/dashboard');
    
    // Since our ProtectedRoute redirects to "/" which redirects to role dashboard
    await expect(page).toHaveURL(/.*\/student\/dashboard/);
  });
});
