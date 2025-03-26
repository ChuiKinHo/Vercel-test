import {
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  UserCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const usePersonalDetailsPreset = () => {
  const { t } = useTranslation();

  return {
    fullname: {
      label: t("common_phases.form.labels.fullname"),
      icon: (
        <UserCircleIcon className="size-5 md:size-8 lg:size-8 text-s5" />
      ),
      placeholder: t("common_phases.form.placeholders.enter_fullname"),
      editable: true,
    },
    username: {
      label: t("common_phases.form.labels.username"),
      icon: (
        <IdentificationIcon className="size-5 md:size-8 lg:size-8 text-s5" />
      ),
      placeholder: t("common_phases.form.placeholders.enter_username"),
      editable: true,
    },
    email: {
      label: t("common_phases.form.labels.email"),
      icon: (
        <EnvelopeIcon className="size-5 md:size-8 lg:size-8 text-s5" />
      ),
      placeholder: t("common_phases.form.placeholders.enter_email"),
      editable: false,
    },
    phone: {
      label: t("common_phases.form.labels.phone"),
      icon: <PhoneIcon className="size-5 md:size-8 lg:size-8 text-s5" />,
      placeholder: t("common_phases.form.placeholders.enter_phone"),
      editable: true,
    },
    location: {
      label: t("common_phases.form.labels.location"),
      icon: <MapPinIcon className="size-5 md:size-8 lg:size-8 text-s5" />,
      placeholder: t("common_phases.form.placeholders.enter_location"),
      editable: true,
    },
  };
};

export default usePersonalDetailsPreset;
