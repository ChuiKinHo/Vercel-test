"use client";

import ToiletVerificationLayout from "@components/ToiletVerificationPage/Layout";
import ToiletVerificationTable from "@components/ToiletVerificationPage/Tables/ToiletVerificationTable";
import withAuth from "@layout/ProtectedRoutes/withAuth";

const ToiletVerificationPage = ({ userData, non_verified_toiletData }) => {

  return (
    <ToiletVerificationLayout>
      <div>
        <ToiletVerificationTable
          non_verified_toiletData={non_verified_toiletData}
        />
      </div>
    </ToiletVerificationLayout>
  );
};

export default withAuth(ToiletVerificationPage);
