"use client";
import { Formik, Form, FormikProps } from "formik";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axiosInstance";
import IRegister from "../types";
import Schema from "./schema";
import { useRouter } from "next/navigation";

export default function RegisterForm2() {
    const router = useRouter();

    const register = async (params: IRegister) => {
        try {
            const { data } = await axiosInstance.post("/auth/register", params);
           
            Swal.fire({
                icon: "success",
                title: data.message,
                showConfirmButton: false,
                timer: 2000,
            }).then(() => router.push("/"));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 md:p-8">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Register</h1>
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        referralCode: "",
                        role: ""
                    }}
                    validationSchema={Schema}
                    onSubmit={(values) => {
                        register(values);
                    }}
                >
                    {(props: FormikProps<IRegister>) => {
                        const { values, errors, touched, handleChange } = props;
                        return (
                            <Form>
                                <div className="mb-4">
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        Name
                                    </label>
                                    <input
                                        className={`bg-gray-50 border ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
                                            } text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5`}
                                        type="text"
                                        name="name"
                                        onChange={handleChange}
                                        value={values.name}
                                    />
                                    {touched.name && errors.name ? (
                                        <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                                    ) : null}
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <input
                                        className={`bg-gray-50 border ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                                            } text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5`}
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        value={values.email}
                                    />
                                    {touched.email && errors.email ? (
                                        <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                                    ) : null}
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <input
                                        className={`bg-gray-50 border ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                                            } text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5`}
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        value={values.password}
                                    />
                                    {touched.password && errors.password ? (
                                        <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                                    ) : null}
                                </div>

                                {/* Role Dropdown */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="role"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        Role
                                    </label>
                                    <select
                                        className={`bg-gray-50 border ${touched.role && errors.role ? 'border-red-500' : 'border-gray-300'
                                            } text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5`}
                                        name="role"
                                        onChange={handleChange}
                                        value={values.role}
                                    >
                                        <option value="" label="Select role" />
                                        <option value="ORGANIZER" label="ORGANIZER" />
                                        <option value="ATTENDEE" label="ATTENDEE" />
                                    </select>
                                    {touched.role && errors.role ? (
                                        <div className="text-red-500 text-sm mt-1">{errors.role}</div>
                                    ) : null}
                                </div>

                                {/* Input untuk Referral Code (Optional) */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="referralCode"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        Referral Code (Optional)
                                    </label>
                                    <input
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
                                        type="text"
                                        name="referralCode"
                                        onChange={handleChange}
                                        value={values.referralCode}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 mt-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition"
                                >
                                    Register
                                </button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
}