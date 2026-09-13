#ifndef PRIORITY_QUEUE_ENGINE_H
#define PRIORITY_QUEUE_ENGINE_H

#include <string>
#include <vector>

struct RequestItem {
    std::string requestId;
    double urgencyScore;
    std::string category;
};

struct PriorityResult {
    std::string requestId;
    int finalPriority;
    int queuePosition;
    double weightedScore;
};

class PriorityQueueEngine {
public:
    PriorityQueueEngine();
    explicit PriorityQueueEngine(const std::string& stateFilePath);
    
    PriorityResult processRequest(const RequestItem& item);
    double calculateWeightedScore(double urgencyScore, const std::string& category) const;
    int determinePriorityTier(double weightedScore) const;

private:
    std::string stateFile;
    std::vector<double> loadExistingScores();
    void saveScores(const std::vector<double>& scores);
};

#endif
