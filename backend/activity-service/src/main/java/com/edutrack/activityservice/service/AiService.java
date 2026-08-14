package com.edutrack.activityservice.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.edutrack.activityservice.domain.Activity;
import com.edutrack.activityservice.domain.ActivityStatus;
import com.edutrack.activityservice.repository.ActivityRepository;
import com.edutrack.activityservice.security.AuthenticatedUser;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Service
public class AiService {

    private final ActivityRepository activityRepository;
    private final RestTemplate restTemplate;

    @Value("${ml.service.url:http://localhost:8000}")
    private String mlServiceUrl;

    public AiService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
        this.restTemplate = new RestTemplate();
    }

    public AiScoreResponse generateScore(AuthenticatedUser student) {
        return generateScoreForStudent(student.id());
    }

    public AiScoreResponse generateScoreForStudent(String studentId) {
        List<Activity> verified = activityRepository.findByStudentIdAndStatus(studentId, ActivityStatus.VERIFIED);
        
        try {
            // Attempt to call the ML Service
            MlScoreRequest request = buildMlRequest(studentId, verified);
            ResponseEntity<AiScoreResponse> response = restTemplate.postForEntity(
                mlServiceUrl + "/predict/score", 
                request, 
                AiScoreResponse.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Failed to reach ML service, falling back to rule-based engine: " + e.getMessage());
        }

        // Circuit Breaker Fallback (Rule-based)
        return calculateFallbackScore(verified);
    }

    private MlScoreRequest buildMlRequest(String studentId, List<Activity> verified) {
        List<MlActivityData> activities = verified.stream()
            .map(a -> new MlActivityData(a.getCategory()))
            .toList();
        return new MlScoreRequest(studentId, activities);
    }

    private AiScoreResponse calculateFallbackScore(List<Activity> verified) {
        int overallScore = calculateScore(verified);
        Map<String, Integer> categoryScores = calculateCategoryScores(verified);
        List<String> strengths = determineStrengths(verified);
        List<String> weaknesses = determineWeaknesses(verified);
        List<String> recommendations = determineRecommendations(verified);
        String diversityAnalysis = analyzeDiversity(verified);
        String scoreExplanation = "[FALLBACK MODE] Score is calculated deterministically due to AI service unavailability: Base (30) + Volume Factor (up to 40) + Diversity Multiplier (up to 30). Your score of " + overallScore + " reflects " + verified.size() + " verified achievements across " + verified.stream().map(Activity::getCategory).distinct().count() + " unique categories.";
        
        return new AiScoreResponse(
            overallScore,
            categoryScores,
            strengths,
            weaknesses,
            recommendations,
            diversityAnalysis,
            scoreExplanation
        );
    }

    private int calculateScore(List<Activity> verified) {
        if (verified.isEmpty()) return 0;
        int baseScore = 30; // Base for starting
        baseScore += Math.min(verified.size() * 10, 40); // Cap volume score at 40
        
        long uniqueCategories = verified.stream().map(Activity::getCategory).distinct().count();
        baseScore += Math.min(uniqueCategories * 8, 30); // Cap diversity score at 30
        
        return Math.min(baseScore, 100);
    }

    private Map<String, Integer> calculateCategoryScores(List<Activity> verified) {
        Map<String, Long> counts = verified.stream()
            .collect(Collectors.groupingBy(Activity::getCategory, Collectors.counting()));
            
        return counts.entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey, e -> Math.min(e.getValue().intValue() * 20, 100)));
    }

    private List<String> determineStrengths(List<Activity> verified) {
        if (verified.isEmpty()) return List.of("No verified activities yet.");
        
        long uniqueCategories = verified.stream().map(Activity::getCategory).distinct().count();
        if (uniqueCategories >= 3) {
            return List.of(
                "Highly versatile skill set.",
                "Consistent participation across multiple domains.",
                "Strong foundational engagement in extracurriculars."
            );
        } else {
            return List.of("Strong focus and specialization in specific areas.", "Dedicated engagement in chosen activities.");
        }
    }

    private List<String> determineWeaknesses(List<Activity> verified) {
        if (verified.isEmpty()) return List.of("Lack of recorded participation.");
        
        long uniqueCategories = verified.stream().map(Activity::getCategory).distinct().count();
        if (uniqueCategories < 2) {
            return List.of("Over-specialization (lack of diversity).", "Missing interdisciplinary experiences.");
        }
        return List.of("Could improve leadership or mentoring roles.", "Opportunity to scale impact of current activities.");
    }

    private List<String> determineRecommendations(List<Activity> verified) {
        if (verified.isEmpty()) return List.of("Start by participating in foundational workshops.", "Join a campus club or society.");
        
        long uniqueCategories = verified.stream().map(Activity::getCategory).distinct().count();
        if (uniqueCategories < 3) {
            return List.of("Branch out into different categories like Technical, Sports, or Arts.", "Try cross-functional hackathons.");
        }
        return List.of("Pursue national-level competitions.", "Take up leadership roles in your current societies.", "Begin mentoring junior students in your strong areas.");
    }

    private String analyzeDiversity(List<Activity> verified) {
        long unique = verified.stream().map(Activity::getCategory).distinct().count();
        if (unique == 0) return "No data available.";
        if (unique == 1) return "Highly focused on a single domain. Excellent for depth, but lacks breadth.";
        if (unique == 2) return "Moderate diversity. Balancing two domains well.";
        return "Excellent diversity. Demonstrates a well-rounded and highly adaptable profile.";
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MlScoreRequest {
        private String studentId;
        private List<MlActivityData> activities;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MlActivityData {
        private String category;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiScoreResponse {
        private int overallScore;
        private Map<String, Integer> categoryScores;
        private List<String> strengths;
        private List<String> weaknesses;
        private List<String> recommendations;
        private String diversityAnalysis;
        private String scoreExplanation;
    }
}
