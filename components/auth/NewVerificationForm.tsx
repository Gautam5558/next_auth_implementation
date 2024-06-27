"use client";

import { useSearchParams } from "next/navigation";
import CardWrapper from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import FormSuccess from "../FormSuccess";
import FormError from "../FormError";
import { newVerification } from "@/actions/newVerification";

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);

  const checkToken = useCallback(() => {
    if (!token) {
      return setError("Mising Token!");
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login page"
    >
      <div className="flex items-center justify-center w-full">
        {!success && !error && <BeatLoader />}
        {success && <FormSuccess message={success} />}
        {error && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
