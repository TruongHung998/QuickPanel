import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Header = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      className="bg-gradient-to-r from-indigo-600 to-[#4f46e5]"
    >
      <Toolbar className="justify-between">
        <Box className="flex items-center gap-3">
          <div className="bg-white p-1 rounded">
            <img
              src="https://product-software.innovavietnam.com/_next/image?url=%2Fimages%2Flogo.png&w=128&q=75"
              alt="Innova Vietnam Logo"
              className="h-8 w-auto"
            />
          </div>
          <Typography
            variant="h6"
            component="div"
            className="text-white font-semibold hidden sm:block"
          >
            QuickPanel
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
