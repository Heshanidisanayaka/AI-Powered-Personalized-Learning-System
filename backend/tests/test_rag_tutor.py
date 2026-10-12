import pytest
from app.services.rag_tutor_service import rag_tutor

def test_rag_kahn_cycle_retrieval():
    results = rag_tutor.retrieve_relevant_chunks("How does Kahn algorithm detect cycles in directed graph?", top_k=1)
    assert len(results) > 0
    top_chunk, score = results[0]
    assert "Kahn" in top_chunk["title"] or "Graph" in top_chunk["topic"]
    assert score > 0.1

def test_rag_attention_scaling_retrieval():
    results = rag_tutor.retrieve_relevant_chunks("Why divide dot product by sqrt(d_k) in transformer attention?", top_k=1)
    assert len(results) > 0
    top_chunk, score = results[0]
    assert "Attention" in top_chunk["title"] or "Transformer" in top_chunk["title"]
    assert score > 0.1

def test_rag_answer_synthesis():
    answer = rag_tutor.answer_query("Explain Kahn algorithm topological sort")
    assert "text" in answer
    assert "code_snippet" in answer
    assert answer["sender"] == "ai"
    assert len(answer["suggested_follow_ups"]) > 0
    assert len(answer["rag_sources_used"]) > 0
