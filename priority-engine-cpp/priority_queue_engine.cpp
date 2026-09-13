#include "priority_queue_engine.h"
#include <algorithm>
#include <fstream>
#include <sstream>

PriorityQueueEngine::PriorityQueueEngine() : stateFile("queue_state.txt") {}

PriorityQueueEngine::PriorityQueueEngine(const std::string& stateFilePath) : stateFile(stateFilePath) {}

double PriorityQueueEngine::calculateWeightedScore(double urgencyScore, const std::string& category) const {
    double weight = 1.0;
    if (category == "SECURITY") {
        weight = 1.5;
    } else if (category == "IT_INFRASTRUCTURE") {
        weight = 1.2;
    } else if (category == "HR") {
        weight = 1.0;
    } else if (category == "GENERAL") {
        weight = 1.0;
    }
    return urgencyScore * weight;
}

int PriorityQueueEngine::determinePriorityTier(double weightedScore) const {
    if (weightedScore > 90.0) {
        return 1;
    }
    if (weightedScore >= 70.0) {
        return 2;
    }
    if (weightedScore >= 50.0) {
        return 3;
    }
    if (weightedScore >= 30.0) {
        return 4;
    }
    return 5;
}

std::vector<double> PriorityQueueEngine::loadExistingScores() {
    std::vector<double> scores;
    std::ifstream file(stateFile);
    if (!file.is_open()) {
        return scores;
    }
    double score;
    while (file >> score) {
        scores.push_back(score);
    }
    return scores;
}

void PriorityQueueEngine::saveScores(const std::vector<double>& scores) {
    std::ofstream file(stateFile);
    if (!file.is_open()) {
        return;
    }
    for (double score : scores) {
        file << score << "\n";
    }
}

PriorityResult PriorityQueueEngine::processRequest(const RequestItem& item) {
    double weightedScore = calculateWeightedScore(item.urgencyScore, item.category);
    int finalPriority = determinePriorityTier(weightedScore);
    
    std::vector<double> scores = loadExistingScores();
    
    int position = 1;
    for (double existing : scores) {
        if (existing > weightedScore) {
            position++;
        }
    }
    
    scores.push_back(weightedScore);
    std::sort(scores.begin(), scores.end(), std::greater<double>());
    saveScores(scores);
    
    PriorityResult result;
    result.requestId = item.requestId;
    result.finalPriority = finalPriority;
    result.queuePosition = position;
    result.weightedScore = weightedScore;
    return result;
}
