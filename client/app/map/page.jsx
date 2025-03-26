"use client";

import dynamic from "next/dynamic";
import withAuth from "@layout/ProtectedRoutes/withAuth";

const MapComponent = dynamic(() => import("@components/MapPage"), {
  ssr: false,
});

const MapPage = ({ userData, isGuestUser, verified_toiletData }) => {
  return (
    <MapComponent userData={userData} isGuestUser={isGuestUser} verified_toiletData={verified_toiletData}></MapComponent>
  );
};

export default withAuth(MapPage);
