import React from "react";
import { Link } from "react-router-dom";
import ImageLight from "../assets/img/In The Ditch Logo_BLKBG.jpg";
import { Label, Input, Button } from "@windmill/react-ui";

function Login() {
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-900 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto items-center">
          <div className="h-32 md:h-auto rounded-lg md:w-10/12 m-8">
            <img
              aria-hidden="true"
              className="object-cover  h-auto rounded-lg dark:hidden"
              src={ImageLight}
              alt="ITD Logo"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className=" text-4xl text-center font-bold text-gray-700 dark:text-gray-200">
                ITD Scheduler
              </h1>
              <h1 className="mb-4 text-xl text-center font-bold text-gray-700 dark:text-gray-200">
                Log In
              </h1>
              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  placeholder="chuck@inventive-group.com"
                />
              </Label>

              <Label className="mt-4">
                <span>Password</span>
                <Input
                  className="mt-1"
                  type="password"
                  placeholder="**********"
                />
              </Label>

              <Button className="mt-4 text-lg" block tag={Link} to="/app">
                Log in
              </Button>

              {/* <hr className="my-8" />

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  to="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </p>
              <p className="mt-1">
                <Link
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  to="/create-account"
                >
                  Create account
                </Link> 
              </p>*/}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
