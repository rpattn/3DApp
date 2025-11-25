package plugin

import (
	"encoding/json"
	"errors"
	"mime"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
)

const (
	assetPrefix        = "/assets/"
	defaultAssetFolder = "public/ddm-files"
)

func defaultAssetRoot() string {
	if override := strings.TrimSpace(os.Getenv("DDM_ASSET_ROOT")); override != "" {
		return override
	}

	return defaultAssetFolder
}

// handlePing is an example HTTP GET resource that returns a {"message": "ok"} JSON response.
func (a *App) handlePing(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	if _, err := w.Write([]byte(`{"message": "ok"}`)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// handleEcho is an example HTTP POST resource that accepts a JSON with a "message" key and
// returns to the client whatever it is sent.
func (a *App) handleEcho(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var body struct {
		Message string `json:"message"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Add("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(body); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (a *App) handleAssets(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet && req.Method != http.MethodHead {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	relative := strings.TrimPrefix(req.URL.Path, assetPrefix)
	if relative == "" || relative == req.URL.Path {
		http.NotFound(w, req)
		return
	}

	cleaned := path.Clean("/" + relative)
	if strings.HasPrefix(cleaned, "../") || cleaned == "/" {
		http.Error(w, "invalid asset path", http.StatusBadRequest)
		return
	}

	resolvedRoot := a.assetRoot
	if resolvedRoot == "" {
		resolvedRoot = defaultAssetRoot()
	}

	fullPath := filepath.Join(resolvedRoot, strings.TrimPrefix(cleaned, "/"))
	info, err := os.Stat(fullPath)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			http.NotFound(w, req)
			return
		}

		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if info.IsDir() {
		http.NotFound(w, req)
		return
	}

	if ctype := mime.TypeByExtension(filepath.Ext(fullPath)); ctype != "" {
		w.Header().Set("Content-Type", ctype)
	}

	http.ServeFile(w, req, fullPath)
}

// registerRoutes takes a *http.ServeMux and registers some HTTP handlers.
func (a *App) registerRoutes(mux *http.ServeMux) {
	mux.HandleFunc(assetPrefix, a.handleAssets)
	mux.HandleFunc("/ping", a.handlePing)
	mux.HandleFunc("/echo", a.handleEcho)
}
