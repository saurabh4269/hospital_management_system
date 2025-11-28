#!/usr/bin/env bash
set -euo pipefail

# Run Phase 2 tests for the FastAPI backend:
# - Phase 0: health endpoint
# - Phase 1: schema validation
# - Phase 2: endpoint behaviour (mock data)

cd "$(dirname "${BASH_SOURCE[0]}")/.."

export PYTEST_DISABLE_PLUGIN_AUTOLOAD=1

./.venv/bin/pytest \
  tests/test_health.py \
  tests/test_schemas.py \
  tests/test_endpoints_phase2.py
