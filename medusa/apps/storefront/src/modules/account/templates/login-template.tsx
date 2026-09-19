"use client"

import { AccountMessagesBlock } from "@lib/data/home-content"
import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = ({ messages }: { messages?: AccountMessagesBlock }) => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="flex w-full justify-center py-8">
      {currentView === "sign-in" ? (
        <Login setCurrentView={setCurrentView} messages={messages} />
      ) : (
        <Register setCurrentView={setCurrentView} messages={messages} />
      )}
    </div>
  )
}

export default LoginTemplate
