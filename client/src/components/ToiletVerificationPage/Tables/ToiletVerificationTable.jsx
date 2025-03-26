import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import useTypeOfToiletMenu from "@components/common/ListGroup/ListGroupMenu/TypeOfToiletMenu";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import CustomTable from "@components/common/Table/CustomTable";
import ToiletVerificationToolbar from "../Toolbar/ToiletVerificationToolbar";
import CustomAvatar from "@components/common/Avatar/Avatar";
import { useTranslation } from "react-i18next";
import EditNonVerifiedToiletModal from "../Modals/EditNonVerifiedToiletModal";
import deleteNonVerifiedToilet from "@services/admin/deleteNonVerifiedToilet";
import axios from "axios";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { displayErrorToast, displaySuccessToast } from "@components/common/Toast/CustomToast";

const ToiletVerificationTable = ({ userData, non_verified_toiletData }) => {
  const { t } = useTranslation();
  const TypeOfToiletMenu = useTypeOfToiletMenu();

  const [rowModesModel, setRowModesModel] = useState({});
  const [selectedTypeOfToilet, setSelectedTypeOfToilet] = useState(null);

  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);

  const [openEditNonVerifiedToiletModal, setOpenEditNonVerifiedToiletModal] =
    useState(false);

  useEffect(() => {
    console.log(non_verified_toiletData);

    // Formatting non_verified_toilet data
    const rowsData = non_verified_toiletData?.map((data, index) => {
      const mediaCounts = data.multimedia.reduce(
        (acc, media) => {
          if (media.multimedia_type === "image") acc.no_of_images += 1;
          if (media.multimedia_type === "video") acc.no_of_videos += 1;
          return acc;
        },
        { no_of_images: 0, no_of_videos: 0 }
      );

      return {
        id: data.toiletId,
        userAvatar: data.user.userAvatar,
        address: data.address_en ? data.address_en : data.address_zh,
        area: data.area_en ? data.area_en : data.area_zh,
        district: data.district_en ? data.district_en : data.district_zh,
        sub_district: data.sub_district_en
          ? data.sub_district_en
          : data.sub_district_zh,
        type_of_toilet: TypeOfToiletMenu[data.type_of_toilet].name,
        no_of_images: mediaCounts.no_of_images,
        no_of_videos: mediaCounts.no_of_videos,
        isMale: data.isMale,
        isFemale: data.isFemale,
        isDisabled: data.isDisabled,
        haveBathroom: data.haveBathroom,
      };
    });

    setRows(rowsData);
  }, []);

  const { mutateAsync: DeleteNonVerifiedToilet } = useMutation({
    mutationFn: deleteNonVerifiedToilet,
    onSuccess: (res) => {
      displaySuccessToast(t('toast.success_messages.non_verifiied_toilet_is_deleted_successfully'));
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        displayErrorToast(err.response?.data?.message);
        return;
      }
    },
  });

  const onDeleteNonVerifiedToilet = (id) => async () => {
    const rowData = rows.find((row) => row.id === id);
    try {
      await DeleteNonVerifiedToilet({toiletId: rowData.id});
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const onRowClick = (rowData) => {
    const selectedRowData = non_verified_toiletData.find(
      (toilet) => toilet.toiletId === rowData.id
    );
    setSelectedRow(selectedRowData);
    setOpenEditNonVerifiedToiletModal(true);
  };

  const columns = [
    {
      field: "userAvatar",
      headerName: t("common_phases.tables.admin_toilet_verification.user"),
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
      field: "address",
      headerName: t(
        "common_phases.tables.admin_toilet_verification.toilet_address"
      ),
      width: 500,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "area",
      headerName: t("common_phases.tables.admin_toilet_verification.area"),
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "district",
      headerName: t("common_phases.tables.admin_toilet_verification.district"),
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "sub_district",
      headerName: t(
        "common_phases.tables.admin_toilet_verification.sub_district"
      ),
      width: 180,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "type_of_toilet",
      headerName: t(
        "common_phases.tables.admin_toilet_verification.type_of_toilet"
      ),
      width: 200,
      editable: false,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: ["Public", "Private", "Shopping Plaza", "Restaurant"],
    },
    {
      field: "no_of_images",
      headerName: t(
        "common_phases.tables.admin_toilet_verification.no_of_images"
      ),
      width: 180,
      headerAlign: "center",
      editable: false,
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-lg">{params.value}</p>
        </div>
      ),
    },
    {
      field: "no_of_videos",
      headerName: t(
        "common_phases.tables.admin_toilet_verification.no_of_videos"
      ),
      width: 180,
      headerAlign: "center",
      editable: false,
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-lg">{params.value}</p>
        </div>
      ),
    },
    {
      field: "isMale",
      headerName: t("common_phases.tables.admin_toilet_verification.is_male"),
      width: 120,
      headerAlign: "center",
      editable: false,
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full h-full">
          {params.value ? (
            <CheckIcon className="size-7 text-green-500" />
          ) : (
            <XMarkIcon className="size-7 text-red-500" />
          )}
        </div>
      ),
    },
    {
      field: "isFemale",
      headerName: t("common_phases.tables.admin_toilet_verification.is_female"),
      width: 140,
      headerAlign: "center",
      editable: false,
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full h-full">
          {params.value ? (
            <CheckIcon className="size-7 text-green-500" />
          ) : (
            <XMarkIcon className="size-7 text-red-500" />
          )}
        </div>
      ),
    },
    {
      field: "isDisabled",
      headerName: t(
        "common_phases.tables.admin_toilet_verification.is_disabled"
      ),
      width: 140,
      headerAlign: "center",
      editable: false,
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full h-full">
          {params.value ? (
            <CheckIcon className="size-7 text-green-500" />
          ) : (
            <XMarkIcon className="size-7 text-red-500" />
          )}
        </div>
      ),
    },
    {
      field: "haveBathroom",
      headerName: t(
        "common_phases.tables.admin_toilet_verification.have_bathroom"
      ),
      width: 180,
      headerAlign: "center",
      editable: false,
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full h-full">
          {params.value ? (
            <CheckIcon className="size-7 text-green-500" />
          ) : (
            <XMarkIcon className="size-7 text-red-500" />
          )}
        </div>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerAlign: "center",
      headerName: t("common_phases.tables.admin_toilet_verification.actions"),
      width: 150,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={onDeleteNonVerifiedToilet(id)}
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
        toolbar={ToiletVerificationToolbar}
        toolbarProps={{ setRows }}
      />

      {openEditNonVerifiedToiletModal && selectedRow && (
        <EditNonVerifiedToiletModal
          onCloseModal={() => {
            setSelectedRow(null);
            setOpenEditNonVerifiedToiletModal(false);
          }}
          rowData={selectedRow}
          setRows={setRows}
        />
      )}
    </div>
  );
};

export default ToiletVerificationTable;
