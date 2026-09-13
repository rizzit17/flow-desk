import re
from typing import Dict, List, Set, Tuple

CATEGORY_KEYWORDS: Dict[str, Set[str]] = {
    "IT_INFRASTRUCTURE": {
        "vpn", "server", "network", "wifi", "database", "cluster", "disk",
        "hardware", "outage", "dns", "router", "firewall", "gateway",
        "datacenter", "latency", "connection", "connect"
    },
    "SECURITY": {
        "breach", "password", "phishing", "malware", "unauthorized",
        "vulnerability", "leak", "compromise", "hack", "ransomware",
        "credential", "auth", "token", "suspicious"
    },
    "HR": {
        "payroll", "benefits", "salary", "onboarding", "offboarding",
        "leave", "vacation", "insurance", "compensation", "recruiting",
        "promotion", "workday", "manager", "policy"
    }
}

URGENCY_KEYWORDS: Set[str] = {
    "urgent", "blocking", "down", "cannot", "immediately", "critical",
    "emergency", "asap", "failure", "halted", "blocker", "broken"
}

def tokenize(text: str) -> List[str]:
    cleaned = text.lower()
    return re.findall(r"\b[a-z0-9_-]+\b", cleaned)

def classify_ticket(title: str, description: str) -> Tuple[str, int, float]:
    tokens = tokenize(f"{title} {description}")
    token_set = set(tokens)
    total_tokens = len(tokens)

    category_counts: Dict[str, int] = {}
    total_matched_keywords = 0

    for category, keywords in CATEGORY_KEYWORDS.items():
        count = sum(1 for token in tokens if token in keywords)
        category_counts[category] = count
        total_matched_keywords += count

    best_category = "GENERAL"
    highest_count = 0
    for category, count in category_counts.items():
        if count > highest_count:
            highest_count = count
            best_category = category

    urgency_matches = sum(1 for token in token_set if token in URGENCY_KEYWORDS)
    base_urgency = 30
    urgency_score = min(100, base_urgency + (urgency_matches * 26))

    if total_tokens == 0:
        confidence = 0.5
    elif highest_count > 0:
        raw_confidence = 0.5 + (highest_count / max(total_tokens, 1)) * 0.5
        confidence = round(min(1.0, raw_confidence), 2)
    else:
        confidence = 0.5

    return best_category, urgency_score, confidence
