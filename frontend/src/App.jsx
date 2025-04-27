import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Paper,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
  Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

import ForceGraph2D from "react-force-graph-2d";

const theme = createTheme({
  palette: {
    primary: { main: "#3f51b5" },
    secondary: { main: "#f50057" },
    background: { default: "#f5f7fa" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: "2.5rem" },
    h2: { fontWeight: 600, fontSize: "1.8rem" },
  },
});

function App() {
  const [inputId, setInputId] = useState("");
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const fgRef = useRef();

  // Tooltip position for hover info box
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    setGraphData(null);
    setHoveredNode(null);

    try {
      const response = await axios.get(
        `https://webcite-71wh.onrender.com/api/search?q=${encodeURIComponent(
          inputId
        )}`
      );

      const { nodes, edges } = response.data;

      // Normalize edges so source and target are string IDs
      const normalizedEdges = edges.map(({ source, target, ...rest }) => ({
        source:
          typeof source === "object" && source !== null ? source.id : source,
        target:
          typeof target === "object" && target !== null ? target.id : target,
        ...rest,
      }));

      setGraphData({ nodes, links: normalizedEdges });
    } catch (err) {
      setError("Failed to fetch data. Make sure to enter a valid DOI.");
    } finally {
      setLoading(false);
    }
  };

  // Zoom to fit on new data load
  useEffect(() => {
    if (graphData && fgRef.current) {
      fgRef.current.zoomToFit(400, 50);
    }
  }, [graphData]);

  const handleNodeHover = useCallback((node) => {
    setHoveredNode(node || null);
  }, []);

  // Track mouse position over canvas for tooltip placement
  const handleCanvasMouseMove = useCallback((e) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4, position: "relative" }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <AutoStoriesIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h1" component="h1" color="primary">
              WebCite
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter DOI"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              sx={{ mr: 2 }}
              InputProps={{ style: { borderRadius: 8 } }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputId.trim() !== "") {
                  handleFetch();
                }
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleFetch}
              disabled={loading || !inputId.trim()}
              startIcon={<SearchIcon />}
              sx={{
                borderRadius: 8,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </Box>

          {error && (
            <Box
              sx={{
                backgroundColor: "error.light",
                color: "error.contrastText",
                p: 2,
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography>{error}</Typography>
            </Box>
          )}

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="primary" size={60} />
            </Box>
          )}
        </Paper>

        {graphData && (
          <Box
            sx={{
              overflow: 'hidden',
              borderRadius: 3,
              boxShadow: 3,
              height: 600,
              position: "relative",
              bgcolor: "background.paper",
              width: "100%",
            }}
          >
            <ForceGraph2D
              ref={fgRef}
              graphData={graphData}
              nodeId="id"
              nodeLabel={(node) => node.title || node.label || node.id}
              linkColor={(link) => link.indexColor || "rgba(50, 50, 50, 0.3)"}
              nodeAutoColorBy="doi"
              style={{ width: "100%", height: "100%" }}
              enableNodeDrag={true}
              onNodeHover={handleNodeHover}
              onNodeClick={(node) => {
                if (node?.doi) {
                  const url = node.doi.startsWith("http")
                    ? node.doi
                    : `https://doi.org/${node.doi}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }
              }}
              onBackgroundClick={() => setHoveredNode(null)}
              onCanvasHover={handleCanvasMouseMove}
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.4}
              d3Force={(force) => {
                force("link").distance(180);
                force("charge").strength(-150);
                force("collision").radius(20).strength(0.7);
              }}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.title || node.label || node.id;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.fillStyle = node === hoveredNode ? "orange" : "blue";
                ctx.beginPath();
                ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(label, node.x, node.y - 12);
              }}
              linkCanvasObject={(link, ctx) => {
                ctx.strokeStyle = "rgba(70, 70, 70, 0.7)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(link.source.x, link.source.y);
                ctx.lineTo(link.target.x, link.target.y);
                ctx.stroke();
              }}
            />
            <ForceGraph2D
              ref={fgRef}
              graphData={graphData}
              nodeId="id"
              nodeLabel={(node) => node.title || node.label || node.id}
              linkColor={(link) => link.indexColor || "rgba(50, 50, 50, 0.3)"}
              nodeAutoColorBy="doi"
              style={{ width: "100%", height: "100%" }}
              enableNodeDrag={true}
              onNodeHover={handleNodeHover}
              onNodeClick={(node) => {
                if (node?.doi) {
                  const url = node.doi.startsWith("http")
                    ? node.doi
                    : `https://doi.org/${node.doi}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }
              }}
              onBackgroundClick={() => setHoveredNode(null)}
              onCanvasHover={handleCanvasMouseMove}
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.4}
              d3Force={(force) => {
                force("link").distance(180);
                force("charge").strength(-150);
                force("collision").radius(20).strength(0.7);
              }}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.title || node.label || node.id;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.fillStyle = node === hoveredNode ? "orange" : "blue";
                ctx.beginPath();
                ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(label, node.x, node.y - 12);
              }}
              linkCanvasObject={(link, ctx) => {
                ctx.strokeStyle = "rgba(70, 70, 70, 0.7)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(link.source.x, link.source.y);
                ctx.lineTo(link.target.x, link.target.y);
                ctx.stroke();
              }}
            />

            {hoveredNode && (
              <Box
                sx={{
                  position: "absolute",
                  top: tooltipPos.y + 10,
                  left: tooltipPos.x + 10,
                  maxWidth: 320,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 3,
                  p: 2,
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {hoveredNode.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Authors:</strong>{" "}
                  {(hoveredNode.authors && hoveredNode.authors.join(", ")) ||
                    "N/A"}
                </Typography>
                {hoveredNode.doi && (
                  <Typography variant="body2">
                    <strong>DOI:</strong>{" "}
                    <Link
                      href={
                        hoveredNode.doi.startsWith("http")
                          ? hoveredNode.doi
                          : `https://doi.org/${hoveredNode.doi}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      color="secondary"
                    >
                      {hoveredNode.doi}
                    </Link>
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
