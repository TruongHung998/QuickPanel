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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch file detail. Please try again later.");
        setLoading(false);
      }
    };
    fetchDetail();
  }, [feature]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!file) return null;

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardContent>
        <Button
          variant="outlined"
          href="/"
          startIcon={<ArrowBackIcon />}
          className="mb-4"
        >
          Back
        </Button>
        <Typography variant="h5" className="mb-2">
          {file.file?.Name}
        </Typography>
        <Divider className="my-2" />
        <Typography variant="body1" className="mb-2">
          Name: {file.name || "N/A"}
        </Typography>
        <Typography variant="body1" className="mb-2">
          Size: {file.file?.Size}
        </Typography>
        <Typography variant="body1" className="mb-2">
          Version: v{file.app_version || "N/A"}
        </Typography>
        <Typography variant="body1" className="mb-2">
          Created: {file.created_at || "N/A"}
        </Typography>
        <Typography variant="body1" className="mb-2">
          VIN: {file.vin || "N/A"}
        </Typography>
        <Typography variant="body1" className="mb-2">
          Garage: {file.garage || "N/A"}
        </Typography>
        <Typography variant="body1" className="mb-2">
          Feature: {file.feature || "N/A"}
        </Typography>
        <Typography variant="body1" className="mb-2">
          Description: {file.description || "No description available"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href={file.file?.Url}
          target="_blank"
          className="mt-4"
        >
          Download
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileLogDetail;
