import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const FileLogDetail = () => {
  const { feature } = useParams();
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `https://nfc.innovavietnam.com/api/v1/cartekpro/filelog?feature=${feature}&searchType=1&limit=1000&page=1`
        );
        // Extract the first item from the data array
        const fileData =
          response.data.data && response.data.data.length > 0
            ? response.data.data[0]
            : null;
        setFile(fileData);

        // Fetch file content if URL exists
        if (fileData?.file?.Url) {
          await fetchFileContent(fileData.file.Url);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch file detail. Please try again later.");
        setLoading(false);
      }
    };
    fetchDetail();
  }, [feature]);

  const fetchFileContent = async (url) => {
    setLoadingContent(true);
    try {
      const response = await axios.get(url, {
        responseType: "text",
        headers: {
          Accept: "text/plain",
        },
      });
      setFileContent(response.data);
    } catch (err) {
      console.error("Failed to fetch file content:", err);
      setFileContent("Failed to load file content.");
    } finally {
      setLoadingContent(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!file) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Button
            variant="outlined"
            href="/"
            startIcon={<ArrowBackIcon />}
            className="mb-4"
          >
            Back
          </Button>
        </div>

        {/* File Info Card */}
        <Card className="mb-4">
          <CardContent>
            <Typography variant="h5" className="mb-2">
              {file.file?.Name}
            </Typography>
            <Divider className="my-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Typography variant="body2" className="mb-1">
                  <strong>Name:</strong> {file.name || "N/A"}
                </Typography>
                <Typography variant="body2" className="mb-1">
                  <strong>Size:</strong> {file.file?.Size}
                </Typography>
                <Typography variant="body2" className="mb-1">
                  <strong>Version:</strong> v{file.app_version || "N/A"}
                </Typography>
                <Typography variant="body2" className="mb-1">
                  <strong>Created:</strong> {file.created_at || "N/A"}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className="mb-1">
                  <strong>VIN:</strong> {file.vin || "N/A"}
                </Typography>
                <Typography variant="body2" className="mb-1">
                  <strong>Garage:</strong> {file.garage || "N/A"}
                </Typography>
                <Typography variant="body2" className="mb-1">
                  <strong>Feature:</strong> {file.feature || "N/A"}
                </Typography>
                <Typography variant="body2" className="mb-1">
                  <strong>Description:</strong>{" "}
                  {file.description || "No description available"}
                </Typography>
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="contained"
                color="primary"
                href={file.file?.Url}
                target="_blank"
                className="mr-2"
              >
                Download Original File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* File Content Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-3">
              File Content:
            </Typography>
            {loadingContent ? (
              <div className="flex justify-center items-center py-8">
                <CircularProgress />
                <Typography variant="body2" className="ml-2">
                  Loading file content...
                </Typography>
              </div>
            ) : (
              <div
                className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto font-mono text-sm whitespace-pre-wrap"
                style={{
                  maxHeight: "70vh",
                  minHeight: "400px",
                }}
              >
                {fileContent || "No content available"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileLogDetail;
