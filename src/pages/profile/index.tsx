"use client";
import React, { useEffect, useState } from "react";
import ProfileForm from "../../components/ProfileForm/ProfileForm";
import { ethers } from "ethers";
import { ParticleProvider } from "@particle-network/provider";
import doctorsideabi from "../../utils/doctorsideabi.json";

export default function Profile() {
  const [prevRec, setPrevRec] = useState();
  useEffect(() => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x81B812D3b365046eD4C6848894cEA7961da59De5",
        doctorsideabi,
        signer
      );
      const accounts = provider.listAccounts();
      accounts.then((account) => {
        const res = contract.userWalletAddresstoUserId(account[0]);
        let length;
        res.then((id) => {
          contract.getMapping6length(id.toNumber()).then((res) => {
            length = res.toNumber();
            console.log(length);
            setPrevRec(length);
          });
        });
      });
    }
  }, []);

  return (
    <div>
      {prevRec === 0 && !prevRec ? (
        <ProfileForm />
      ) : (
        <h2> You have already submitted the form </h2>
      )}
    </div>
  );
}
