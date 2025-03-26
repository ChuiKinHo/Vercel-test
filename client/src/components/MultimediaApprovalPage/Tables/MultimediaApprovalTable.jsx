import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import useTypeOfToiletMenu from "@components/common/ListGroup/ListGroupMenu/TypeOfToiletMenu";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CustomTable from "@components/common/Table/CustomTable";
import MultimediaApprovalToolbar from "../Toolbar/MultimediaApprovalToolbar";
import CustomAvatar from "@components/common/Avatar/Avatar";
import { useTranslation } from "react-i18next";
import EditNonVerifiedMultimediaModal from "@components/MultimediaApprovalPage/Modals/EditNonVerifiedMultimediaModal";
import deleteNonVerifiedMultimedia from "@services/admin/deleteNonVerifiedMultimedia";
import axios from "axios";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
  displayErrorToast,
  displaySuccessToast,
} from "@components/common/Toast/CustomToast";

const MultimediaApprovalTable = ({ userData, non_verified_multimedia }) => {
  const { t } = useTranslation();
  const TypeOfToiletMenu = useTypeOfToiletMenu();

  const [rowModesModel, setRowModesModel] = useState({});

  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);

  const [
    openEditNonVerifiedMultimediaModal,
    setOpenEditNonVerifiedMultimediaModal,
  ] = useState(false);

  useEffect(() => {
    // Formatting non_verified_multimedia
    const rowsData = non_verified_multimedia?.map((data, index) => {
      return {
        id: `${data.toilet._id}-${data.user._id}`,
        userAvatar: data.user.userAvatar,
        no_of_multimedia: data.multimedia.length,
        address: data.toilet.address_en
          ? data.toilet.address_en
          : data.toilet.address_zh,
        area: data.toilet.area_en ? data.toilet.area_en : data.toilet.area_zh,
        district: data.toilet.district_en
          ? data.toilet.district_en
          : data.toilet.district_zh,
        sub_district: data.toilet.sub_district_en
          ? data.toilet.sub_district_en
          : data.toilet.sub_district_zh,
        type_of_toilet: TypeOfToiletMenu[data.toilet.type_of_toilet].name,
      };
    });
    console.log(rowsData);
    setRows(rowsData);
  }, [non_verified_multimedia]);

  const { mutateAsync: DeleteNonVerifiedMultimedia } = useMutation({
    mutationFn: deleteNonVerifiedMultimedia,
    onSuccess: (res) => {
      displaySuccessToast(
        t(
          "toast.success_messages.non_verifiied_multimedia_is_deleted_successfully"
        )
      );
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const onDeleteNonVerifiedMultimedia = (id) => async () => {
    // Formatting data
    const deletedMultimediaIds = non_verified_multimedia
      ?.find(
        (multimedia) => `${multimedia.toilet._id}-${multimedia.user._id}` === id
      )
      .multimedia.map((multimedia) => multimedia.multimediaId);

    try {
      await DeleteNonVerifiedMultimedia({
        multimediaIds: deletedMultimediaIds,
      });
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const onRowClick = (rowData) => {
    const selectedRowData = non_verified_multimedia.find(
      (multimedia) =>
        `${multimedia.toilet._id}-${multimedia.user._id}` === rowData.id
    );
    setSelectedRow(selectedRowData);
    setOpenEditNonVerifiedMultimediaModal(true);
  };

  const columns = [
    {
      field: "userAvatar",
      headerName: t("common_phases.tables.admin_multimedia_approval.user"),
      width: 130,
      editable: false,
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full h-full">
          <CustomAvatar
            src={params.value}
            alt="User Avatar"
            varient="size-10"
          />
        </div>
      ),
    },
    {
      field: "no_of_multimedia",
      headerName: t(
        "common_phases.tables.admin_multimedia_approval.no_of_multimedia"
      ),
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "address",
      headerName: t(
        "common_phases.tables.admin_multimedia_approval.toilet_address"
      ),
      width: 500,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "area",
      headerName: t("common_phases.tables.admin_multimedia_approval.area"),
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "district",
      headerName: t("common_phases.tables.admin_multimedia_approval.district"),
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "sub_district",
      headerName: t(
        "common_phases.tables.admin_multimedia_approval.sub_district"
      ),
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "type_of_toilet",
      headerName: t(
        "common_phases.tables.admin_multimedia_approval.type_of_toilet"
      ),
      width: 200,
      editable: false,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: ["Public", "Private", "Shopping Plaza", "Restaurant"],
    },
    {
      field: "actions",
      type: "actions",
      headerAlign: "center",
      headerName: t("common_phases.tables.admin_multimedia_approval.actions"),
      width: 150,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={onDeleteNonVerifiedMultimedia(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="mt-5">
      <CustomTable
        rows={rows}
        columns={columns}
        language="en_us"
        customZhHkLocalText={{
          noRowsLabel: "沒有資料",
          footerTotalRows: "總行數:",
        }}
        rowModesModel={rowModesModel}
        // onRowModesModelChange={handleRowModesModelChange}
        onRowClick={onRowClick}
        // processRowUpdate={processRowUpdate}
        toolbar={MultimediaApprovalToolbar}
        toolbarProps={{ setRows }}
      />

      {openEditNonVerifiedMultimediaModal && selectedRow && (
        <EditNonVerifiedMultimediaModal
          onCloseModal={() => {
            setSelectedRow(null);
            setOpenEditNonVerifiedMultimediaModal(false);
          }}
          rowData={selectedRow}
          setRows={setRows}
        />
      )}
    </div>
  );
};

export default MultimediaApprovalTable;
