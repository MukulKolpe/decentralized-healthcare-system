//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract UserSide_Healthcare{

    //roles:
    // 1: System Admin
    // 2: Doctor
    // 3: Patient
    // 4: Other Hospital Employees
    // 5: Lab Employees

    uint256 public totalUsers = 1;
    struct User{
        uint256 userId;
        string userName;
        string userAadhar;
        string userLicenseNo;
        uint256 userAge;
        string userEmail;
        string userSpeciality;
        string userProfileImg;
        string userMedicalDegree;
        uint256 userRole;
        address userWalletAddress;
        bool isVerified;
    }

    struct PatientHistory{
        uint256 userId;
        bool isHandicap;
        bool isBp;
        bool isDiabetes;
        uint256 userExp;
    }

    mapping(address => uint256) public userWalletAddresstoUserId;
    mapping(uint256 => User) public userIdtoUser;
    mapping(uint256 => bool) public userIdtoBlacklist;
    mapping(uint256 => uint256) public userIdtoReportUser;
    mapping(uint256 => PatientHistory) public userIdtoPatientHistory;
    mapping(uint256 => string[]) public userIdtoPrevMedicalHistory; // mapping 6
    mapping(string => uint256) public userEmailtoUserId;
    address admin;

    function createUser(string memory _userName,string memory _userAadhar,string memory _userLicenseNo,uint256 _userAge,string memory _userEmail,string memory _userSpeciality,string memory _userProfileImg,string memory _userMedicalDegree,uint256 _userRole) public {
        if(_userRole == 3){
            User memory u1 = User(totalUsers,_userName,_userAadhar,_userLicenseNo,_userAge,_userEmail,_userSpeciality,_userProfileImg,_userMedicalDegree,_userRole,msg.sender,false);
            userIdtoUser[totalUsers] = u1;
            takeUserHistory(totalUsers, false, false, false, 0);
            require(userWalletAddresstoUserId[u1.userWalletAddress] == 0 && userEmailtoUserId[u1.userEmail] == 0,"User with this wallet address or email already exists");
            userIdtoUser[totalUsers].isVerified = true;
            userWalletAddresstoUserId[u1.userWalletAddress] = u1.userId;
            userEmailtoUserId[u1.userEmail] = u1.userId;
            userIdtoBlacklist[totalUsers] = false;
            userIdtoReportUser[totalUsers] = 0;
            totalUsers++;
        }
        else{
            User memory u1 = User(totalUsers,_userName,_userAadhar,_userLicenseNo,_userAge,_userEmail,_userSpeciality,_userProfileImg,_userMedicalDegree,_userRole,msg.sender,false);
            userIdtoUser[totalUsers] = u1;
            takeUserHistory(totalUsers, false, false, false, 0);
            totalUsers++;
        }
        
    }

    function takeUserHistory (uint256 _userId,bool _isHandicap,bool _isBp,bool _isDiabetes,uint256 _userExp) public{
        PatientHistory memory pt1 = PatientHistory(totalUsers,_isHandicap,_isBp,_isDiabetes,_userExp);
        userIdtoPatientHistory[_userId] = pt1;
    }

    constructor(){
        admin = msg.sender;
    }

    function approveUser(uint256 _userId) public {
        require(msg.sender == admin,"Only Admin can call this function");
        User memory u1 = userIdtoUser[_userId];
        require(userWalletAddresstoUserId[u1.userWalletAddress] == 0 && userEmailtoUserId[u1.userEmail] == 0,"User with this wallet address or email already exists");
        userIdtoUser[_userId].isVerified = true;
        userWalletAddresstoUserId[u1.userWalletAddress] = u1.userId;
        userEmailtoUserId[u1.userEmail] = u1.userId;
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

    function getMapping6length(uint256 _userId) public view returns(uint256) {
        return userIdtoPrevMedicalHistory[_userId].length;
    }
}