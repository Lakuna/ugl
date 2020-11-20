rem Requires Python.
cd ../..
start "Python Server" python -m http.server
start "" "http://localhost:8000"