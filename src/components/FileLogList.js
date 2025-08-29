import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import DescriptionIcon from "@mui/icons-material/Description";
import RefreshIcon from "@mui/icons-material/Refresh";

const FileLogList = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9); // 9 per page for 3x3 grid
  const [total, setTotal] = useState(0);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [filter, setFilter] = useState("all"); // "all", "cartek1", "cartek2"

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, [page, limit, filter]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      // Fetch a larger dataset to ensure we have enough data after filtering
      const response = await axios.get(
        `https://nfc.innovavietnam.com/api/v1/cartekpro/filelog?page=1&limit=1000`
      );
      let allData = response.data.data;

      // Apply filtering
      if (filter === "cartek2") {
        allData = allData.filter((file) => file.name === "CartekNew");
      } else if (filter === "cartek1") {
        allData = allData.filter((file) => file.name !== "CartekNew");
      }

      // Apply client-side pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = allData.slice(startIndex, endIndex);

      setFiles(paginatedData);
      setTotal(allData.length);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch files. Please try again later.");
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when changing filter
  };

  const handleRefresh = () => {
    setPage(1);
    fetchFiles();
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

  const handleItemClick = (file) => {
    if (!file.feature || file.feature === null) {
      setShowErrorDialog(true);
      return;
    }
    navigate(`/${file.feature}`);
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

  // Pagination controls
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex justify-center mb-6">
        <Button
          variant={filter === "all" ? "contained" : "outlined"}
          onClick={() => handleFilterChange("all")}
          className="mx-1"
        >
          All
        </Button>
        <Button
          variant={filter === "cartek1" ? "contained" : "outlined"}
          onClick={() => handleFilterChange("cartek1")}
          className="mx-1"
        >
          Cartek1
        </Button>
        <Button
          variant={filter === "cartek2" ? "contained" : "outlined"}
          onClick={() => handleFilterChange("cartek2")}
          className="mx-1"
        >
          Cartek2
        </Button>
        <Button
          variant="outlined"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          className="mx-1"
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

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
                  className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  sx={{ display: "flex", flexDirection: "column" }}
                  onClick={() => handleItemClick(file)}
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
                        {`Description: ${
                          file.description || "No description available"
                        }`}
                      </Typography>
                    </div>

                    {/* Download Button */}
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file.file.Url);
                      }}
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
      {/* Pagination Controls */}
      <div className="flex flex-wrap justify-between items-center mt-6">
        <div className="flex items-center">
          <Button
            variant="outlined"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          {/* Page number buttons (show max 3 at a time) */}
          <div className="flex mx-2">
            {(() => {
              let start = Math.max(1, page - 1);
              let end = Math.min(totalPages, start + 2);
              if (end - start < 2) start = Math.max(1, end - 2);
              const pageNumbers = [];
              for (let i = start; i <= end; i++) pageNumbers.push(i);
              return pageNumbers.map((num) => (
                <Button
                  key={num}
                  variant={num === page ? "contained" : "outlined"}
                  color={num === page ? "primary" : "inherit"}
                  size="small"
                  onClick={() => setPage(num)}
                  style={{ minWidth: 36, margin: "0 2px" }}
                  disabled={num === page}
                >
                  {num}
                </Button>
              ));
            })()}
          </div>
          <Button
            variant="outlined"
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
        {/* Limit selector */}
        <div className="ml-4 mt-2 sm:mt-0">
          <Typography variant="body2" component="span" className="mr-2">
            Per page:
          </Typography>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            {[6, 9, 12, 18, 24].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Dialog */}
      <Dialog
        open={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">{"Error"}</DialogTitle>
        <DialogContent>
          <Typography id="error-dialog-description">
            File này không có ID, không thể được xem chi tiết.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowErrorDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileLogList;
