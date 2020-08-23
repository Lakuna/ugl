rem Host test on python server.
rem CTRL+F5 when refreshing to clear cache.
start "Python Server" python -m http.server
start "" "http://localhost:8000/test/_full"
