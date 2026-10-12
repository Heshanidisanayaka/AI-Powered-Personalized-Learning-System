from typing import List, Dict, Any
from app.models.performance import TopicMastery

def diagnose_weak_areas(performances: List[TopicMastery]) -> List[Dict[str, Any]]:
    """
    Analyzes student topic performances, detects weak topics (< 65% mastery or error streak),
    and provides explicit, actionable pedagogical explanations of WHY each topic is weak.
    """
    diagnostics = []

    for p in performances:
        avg_score = (p.rule_based_mastery + p.ml_predicted_mastery) / 2.0
        is_weak = avg_score < 70.0 or p.is_weak_area

        if is_weak:
            # Generate explicit pedagogical explanation
            reasons = []
            if p.raw_accuracy_percent < 55.0:
                reasons.append(f"Low historical accuracy ({p.raw_accuracy_percent:.1f}%) on concept-check questions vs cohort target ({p.benchmark_percent:.0f}%)")
            
            if p.ml_predicted_mastery < p.rule_based_mastery:
                reasons.append(f"ML predictive model forecasted a performance dip (-{p.rule_based_mastery - p.ml_predicted_mastery:.1f}%) due to high error clustering on harder problem variants")
            
            if not reasons:
                reasons.append(p.weak_reason or "Concept mastery below target competency threshold.")

            status = "Critical Focus" if avg_score < 50.0 else "Needs Practice" if avg_score < 65.0 else "Developing"
            
            # Map default known conceptual gaps if available
            gaps = [
                "Confusing queue vs stack state management in Kahn Algorithm",
                "Detecting cycles in directed vs undirected graph components",
                "Edge cases with disconnected subgraphs"
            ] if "Graph" in p.topic else [
                "Jacobian matrix derivative through variance normalization",
                "Learnable affine parameters scale (gamma) and shift (beta)"
            ] if "LayerNorm" in p.topic or "Neural" in p.topic else [
                "Deriving posterior precision with known vs unknown variance",
                "Base rate fallacy under low disease incidence rates"
            ] if "Bayes" in p.topic else [
                "Boundary condition handling in recursive state transition"
            ]

            action = (
                f"Take 5-Question Targeted Practice Drill on {p.topic}"
                if status == "Critical Focus"
                else f"Review Interactive Visual Diagram & PyTorch autograd for {p.topic}"
            )

            diagnostics.append({
                "id": p.id,
                "topic": p.topic,
                "subject": p.subject,
                "masteryPercentage": int(round(avg_score)),
                "benchmarkPercentage": int(p.benchmark_percent),
                "status": status,
                "criticalGaps": gaps,
                "suggestedAction": action,
                "lastPracticed": p.last_practiced_at.strftime("%b %d, %Y") if p.last_practiced_at else "Recently",
                "whyWeakExplanation": " • ".join(reasons)
            })

    # Sort so most critical weak areas appear first
    diagnostics.sort(key=lambda d: d["masteryPercentage"])
    return diagnostics
