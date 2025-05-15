import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import DescriptionIcon from "@mui/icons-material/Description";

const FileLogList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        "https://nfc.innovavietnam.com/api/v1/cartekpro/filelog"
      );
      setFiles(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch files. Please try again later.");
      setLoading(false);
    }
  };

  const handleDownload = (fileName) => {
    window.open(fileName);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    return bytes;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="mb-4">
        {error}
      </Alert>
    );
  }

  if (files.length === 0) {
    return (
      <Card className="text-center p-8">
        <InsertDriveFileIcon className="text-gray-400 text-6xl mb-4" />
        <Typography variant="h6" color="textSecondary">
          No files available
        </Typography>
      </Card>
    );
  }

  return (
    <AnimatePresence>
      <Grid container spacing={3}>
        {files.map((file, index) => (
          <Grid item xs={12} sm={6} lg={4} key={file.name}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className="h-full hover:shadow-lg transition-shadow duration-300"
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <CardContent className="flex-grow">
                  {/* File Name and Icon */}
                  <div className="flex items-center mb-3">
                    <InsertDriveFileIcon className="text-primary-main mr-2" />
                    <Typography
                      variant="h6"
                      className="truncate"
                      title={file.file.Name}
                    >
                      {file.file.Name}
                    </Typography>
                  </div>

                  <Divider className="my-3" />

                  {/* File Size */}
                  <div className="flex items-center mb-3">
                    <DataUsageIcon
                      fontSize="small"
                      className="mr-1 text-gray-600"
                    />
                    <Typography variant="body2" className="text-gray-600">
                      Size: {formatFileSize(file.file.Size)}
                    </Typography>
                  </div>

                  {/* Version and Created Date */}
                  <div className="mb-3">
                    <Chip
                      label={`v${file.app_version || "N/A"}`}
                      size="small"
                      className="mb-2"
                      color="primary"
                    />
                    <div className="flex items-center text-gray-600 text-sm">
                      <AccessTimeIcon fontSize="small" className="mr-1" />
                      {formatDate(file.created_at)}
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="mb-3">
                    <div className="flex items-center mb-1">
                      <DirectionsCarIcon
                        fontSize="small"
                        className="mr-1 text-gray-600"
                      />
                      <Typography variant="body2" className="text-gray-600">
                        VIN: {file.vin || "N/A"}
                      </Typography>
                    </div>
                    <div className="flex items-center">
                      <BuildIcon
                        fontSize="small"
                        className="mr-1 text-gray-600"
                      />
                      <Typography variant="body2" className="text-gray-600">
                        Garage: {file.garage || "N/A"}
                      </Typography>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex mb-4">
                    <DescriptionIcon
                      fontSize="small"
                      className="mr-1 text-gray-600"
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="line-clamp-2"
                      title={file.description}
                    >
                      {`Description: ${file.description || "No description available"}`}
                    </Typography>
                  </div>

                  {/* Download Button */}
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(file.file.Url)}
                    className="w-full mt-auto"
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </AnimatePresence>
  );
};

export default FileLogList;
