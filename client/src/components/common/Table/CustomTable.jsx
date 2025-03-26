import React, { useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const CustomTable = ({
  rows,
  columns,
  language = "en_us",
  customZhHkLocalText,
  rowModesModel,
  onRowModesModelChange,
  onRowClick,
  processRowUpdate,
  toolbar,
  toolbarProps,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "80vh",
        padding: 0, // Remove padding
        margin: 0,
        display: "flex",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "rgba(29, 29, 31, 0.9)",
            color: "#D1D5DB",
            fontSize: "1rem",
          },
          "& .MuiDataGrid-footerContainer": {
            justifyContent: "flex-start",
          },
          "& .MuiDataGrid-row": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f5f5f5",
          },
          borderRadius: 5,
          height: "85vh",
        }}
        slots={{
          toolbar: toolbar,
        }}
        slotProps={{
          toolbar: toolbarProps,
        }}
        rowModesModel={rowModesModel}
        onRowModesModelChange={onRowModesModelChange}
        onRowClick={(params) => onRowClick && onRowClick(params.row)}
        processRowUpdate={processRowUpdate}
        checkboxSelection
        disableRowSelectionOnClick
        pageSizeOptions={[15, 30, 50]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 15,
            },
          },
        }}
        localeText={language === "en_us" ? undefined : customZhHkLocalText}
      />
    </Box>
  );
};

export default CustomTable;
