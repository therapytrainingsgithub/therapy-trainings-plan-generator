import React from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ChangePasswordForm = () => {
  const router = useRouter();

  // Validation schema for password
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (
    values: { password: string; confirmPassword: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);

    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      toast.error(`Error changing password: ${error.message}`);
      setSubmitting(false);
      return;
    }

    toast.success("Password updated successfully!");
    router.push("/");
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col items-center space-y-6">
          <div className="flex flex-col space-y-1 w-[50%]">
            <label htmlFor="password">New Password</label>
            <Field
              className="rounded-md px-5 py-2 border-2"
              type="password"
              id="password"
              name="password"
              placeholder="Enter new password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <div className="flex flex-col space-y-1 w-[50%]">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Field
              className="rounded-md px-5 py-2 border-2"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          <div className="w-[50%]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d] w-full"
            >
              {isSubmitting ? "Submitting..." : "Change Password"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePasswordForm;
