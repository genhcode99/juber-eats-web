import React from "react"
import Button from "../../components/Button"
import { useMe } from "../../hooks/useMe"

export const EditProfile = () => {
  const { data: userData } = useMe()
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form className="grid gap-3 mt-5 w-full max-w-screen-sm mb-5">
        <input
          className="input"
          type="email"
          placeholder={userData?.me.email}
        />
        <input className="input" type="password" placeholder="Password" />
        <Button canClick={true} loading={false} actionText="Save Profile" />
      </form>
    </div>
  )
}
