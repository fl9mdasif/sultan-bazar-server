// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { z } from "zod";
// import Link from "next/link";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { loginUser } from "@/services/actions/loginUser";
// import { storeUserInfo } from "@/services/auth.services";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { loginSchema } from "@/utils/interface";
// import RForm from "../components/Forms/RForm";
// import RInput from "../components/Forms/RInput";

// export type ValidationSchemaType = z.infer<typeof loginSchema>;

// const LoginPage = () => {
//   const router = useRouter();
//   const [error, setError] = useState("");

//   const handelSubmit = async (values: any) => {
//     try {
//       const res = await loginUser(values);

//       if (res?.data?.accessToken) {
//         toast.success(res?.message);

//         storeUserInfo({ accessToken: res?.data?.accessToken });

//         router.push("/dashboard");
//         router.refresh();
//       } else {
//         setError(res.message);
//         // console.log(res);
//       }
//     } catch (err: any) {
//       console.error(err.message);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4">
//       {/* <Navbar /> */}
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="w-full max-w-xl rounded-lg bg-white p-6 text-center shadow-lg">
//           <div className="flex flex-col items-center justify-center">
//             <div>
//               {/* <Image src={assets.svgs.logo} width={50} height={50} alt="logo" /> */}
//             </div>
//             <div>
//               <h2 className="text-2xl font-semibold text-gray-900">
//                 Login User
//               </h2>
//             </div>
//           </div>

//           {error && (
//             <div className="mt-2 rounded-md bg-red-100 p-2 text-sm font-medium text-red-700">
//               <p>{error}</p>
//             </div>
//           )}

//           <div className="mt-6 text-left">
//             <RForm onSubmit={handelSubmit} resolver={zodResolver(loginSchema)}>
//               <div className="my-2 grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div>
//                   <RInput
//                     name="email"
//                     label="Email"
//                     type="email"
//                     fullWidth={true}
//                     required={true}
//                   />
//                 </div>
//                 <div>
//                   <RInput
//                     name="password"
//                     label="Password"
//                     type="password"
//                     fullWidth={true}
//                     required={true}
//                   />
//                 </div>
//               </div>

//               {/* <p className="mb-2 text-right text-sm font-light">
//                  Forgot Password?
//                </p> */}

//               <button
//                 type="submit"
//                 className="my-3 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
//               >
//                 Login
//               </button>
//               <p className="text-center text-sm font-light text-gray-600">
//                 Dont have an account?{" "}
//                 <Link
//                   href="/register"
//                   className="font-medium text-blue-600 hover:underline"
//                 >
//                   Create an account
//                 </Link>
//               </p>
//             </RForm>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
