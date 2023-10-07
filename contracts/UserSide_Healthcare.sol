//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract UserSide_Healthcare{

    //roles:
    // 1: System Admin
    // 2: Doctor
    // 3: Patient
    // 4: Other Hospital Employees

    uint256 public totalUsers = 1;
    struct User{
        uint256 userId;
        string userName;
        string userAadhar;
        string userLicenseNo;
        uint256 userAge;
        uint256 userExp;
        string userSpeciality;
        string userProfileImg;
        string userMedicalDegree;
        uint256 userRole;
        address userWalletAddress;
        bool isVerified;
    }

    mapping(address => uint256) public userWalletAddresstoUserId;
    mapping(uint256 => User) public userIdtoUser;
    mapping(uint256 => bool) public userIdtoBlacklist;
    mapping(uint256 => uint256) public userIdtoReportUser;
    address admin;

    function createUser(string memory _userName,string memory _userAadhar,string memory _userLicenseNo,uint256 _userAge,uint256 _userExp,string memory _userSpeciality,string memory _userProfileImg,string memory _userMedicalDegree,uint256 _userRole) public {
        User memory u1 = User(totalUsers,_userName,_userAadhar,_userLicenseNo,_userAge,_userExp,_userSpeciality,_userProfileImg,_userMedicalDegree,_userRole,msg.sender,false);
        userIdtoUser[totalUsers] = u1;
        totalUsers++;
    }

    constructor(){
        admin = msg.sender;
    }

    function approveUser(uint256 _userId) public {
        require(msg.sender == admin,"Only Admin can call this function");
        User memory u1 = userIdtoUser[_userId];
        require(userWalletAddresstoUserId[u1.userWalletAddress] == 0,"User with this wallet address already exists");
        userIdtoUser[_userId].isVerified = true;
        userWalletAddresstoUserId[u1.userWalletAddress] = u1.userId;
        userIdtoBlacklist[_userId] = false;
        userIdtoReportUser[_userId] = 0;
    }

    function disApproveUser(uint256 _userId) public {
        require(msg.sender == admin,"Only admin can call this function");
        userIdtoUser[_userId].isVerified = false;
        userIdtoBlacklist[_userId] = true;
    }

    function reportUser(uint256 _userId) public {
        userIdtoReportUser[_userId]++;
        if(userIdtoReportUser[_userId] > 100){
            userIdtoBlacklist[_userId] = true;
        }
    }
}