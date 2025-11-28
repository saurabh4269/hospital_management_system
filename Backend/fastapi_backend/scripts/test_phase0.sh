#!/usr/bin/env bash
set -euo pipefail

# Run Phase 0 tests for the FastAPI backend (health endpoint only)

# Move to project root (Backend/fastapi_backend)
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Disable auto-loading of external pytest plugins (e.g. ROS-related ones)
export PYTEST_DISABLE_PLUGIN_AUTOLOAD=1

# Run the health-check test using the local venv
./.venv/bin/pytest tests/test_health.py
