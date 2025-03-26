"use client";

import MultimediaApprovalLayout from "@components/MultimediaApprovalPage/Layout";
import MultimediaApprovalTable from "@components/MultimediaApprovalPage/Tables/MultimediaApprovalTable";
import withAuth from "@layout/ProtectedRoutes/withAuth";

const MultimediaApprovalPage = ({ userData, non_verified_multimedia }) => {
  console.log(non_verified_multimedia)
  return (
    <MultimediaApprovalLayout>
      <div>
        <MultimediaApprovalTable
          non_verified_multimedia={non_verified_multimedia}
        />
      </div>
    </MultimediaApprovalLayout>
  );
};

export default withAuth(MultimediaApprovalPage);
