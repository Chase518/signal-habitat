"""Minimal FastAPI wrapper around the analysis pipeline.

Not the final integration point — the Java/Quarkus backend will later
call this service as an outbound adapter (see docs/decisions.md). For
now this just gets `run_pipeline()`'s output in front of the React
frontend so the first chart can be built.
"""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.pipeline import run_pipeline

app = FastAPI(title="Signal: Habitat — Analysis Core")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/analysis")
def get_analysis() -> dict:
    return run_pipeline()
