#include "priority_queue_engine.h"
#include <iostream>
#include <string>
#include <sstream>

std::string extractStringField(const std::string& json, const std::string& key) {
    std::string searchKey = "\"" + key + "\"";
    size_t keyPos = json.find(searchKey);
    if (keyPos == std::string::npos) {
        return "";
    }
    size_t colonPos = json.find(':', keyPos + searchKey.length());
    if (colonPos == std::string::npos) {
        return "";
    }
    size_t firstQuote = json.find('\"', colonPos + 1);
    if (firstQuote == std::string::npos) {
        return "";
    }
    size_t secondQuote = json.find('\"', firstQuote + 1);
    if (secondQuote == std::string::npos) {
        return "";
    }
    return json.substr(firstQuote + 1, secondQuote - firstQuote - 1);
}

double extractNumberField(const std::string& json, const std::string& key) {
    std::string searchKey = "\"" + key + "\"";
    size_t keyPos = json.find(searchKey);
    if (keyPos == std::string::npos) {
        return 0.0;
    }
    size_t colonPos = json.find(':', keyPos + searchKey.length());
    if (colonPos == std::string::npos) {
        return 0.0;
    }
    size_t start = json.find_first_not_of(" \t\n\r", colonPos + 1);
    if (start == std::string::npos) {
        return 0.0;
    }
    size_t end = json.find_first_of(",}\n\r", start);
    std::string numStr = (end == std::string::npos) ? json.substr(start) : json.substr(start, end - start);
    try {
        return std::stod(numStr);
    } catch (...) {
        return 0.0;
    }
}

int main() {
    std::stringstream buffer;
    buffer << std::cin.rdbuf();
    std::string input = buffer.str();

    if (input.empty()) {
        std::cerr << "Empty input received" << std::endl;
        return 1;
    }

    RequestItem item;
    item.requestId = extractStringField(input, "requestId");
    item.urgencyScore = extractNumberField(input, "urgencyScore");
    item.category = extractStringField(input, "category");

    PriorityQueueEngine engine;
    PriorityResult result = engine.processRequest(item);

    std::cout << "{\"requestId\":\"" << result.requestId
              << "\",\"finalPriority\":" << result.finalPriority
              << ",\"queuePosition\":" << result.queuePosition
              << "}" << std::endl;

    return 0;
}
