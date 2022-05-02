import React, { useState } from 'react'
import { Drawer, Dropdown, Menu } from 'antd'
import { IoArrowBack, IoPersonAdd } from "react-icons/io5";
import { IoMdExit, } from "react-icons/io";
import { Avatar, Image } from '@vechaiui/react';
import { AiOutlineDown } from "react-icons/ai";
// import openNotificationWithIcon from './Notification';
import { useSelector, useDispatch } from 'react-redux'
import openNotificationWithIcon from './Notification';
import callApi from '../apiCalls';
import ChatsLoading from './ChatsLoading';
import { updateSelectedUsers } from '../redux/slices/chats';
import ModelAddParticipent from './ModelAddParticipent';
function DrawerGroupInfo({ showGroupInfoDrawer, closeGroupInfoDrawer }) {
    const [isRemoveUserLoading, setIsRemoveUserLoading] = useState(false);
    const [addParticipentModal, setAddParticipentModal] = useState(false);
    const dispatch = useDispatch()
    const [removeParticipent, setremoveParticipent] = useState(false);
    const {
        chats: { currSelectedChat },
        auth: { user: loggedInUser }
    } = useSelector(state => state)

    async function reqToRemoveParticipent(userToRemove) {
        try {
            const body = {
                groupChatId: currSelectedChat._id,
                userId: userToRemove._id,
            }
            setIsRemoveUserLoading(true);
            const data = await callApi.apiMethod('removeParticipent', 'PUT', body);
            dispatch(updateSelectedUsers({ users: data.chat.users }))
            openNotificationWithIcon('success', data.message);
            setIsRemoveUserLoading(false);
        } catch (error) {
            setIsRemoveUserLoading(false);
            openNotificationWithIcon('error', error.message)
        }
    }
    function removeParticipentFromList() {
        setremoveParticipent(true)
    }
    function handleSettings(key, userToRemove) {
        switch (key) {
            case 'removeParticipent':
                reqToRemoveParticipent(userToRemove)
                break;
            default:
                break;
        }
    }

    const removeParticipentDropdown = (userToRemove) =>
        <Menu
            onClick={(e) => handleSettings(e.key, userToRemove)}
            className='dropDownSettings pt-5 pb-5 text-2xl text-black'
            items={[
                {
                    label: <span>Remove</span>,
                    key: 'removeParticipent',
                },
            ]}
        />


    return (
        <Drawer
            className='drawer-group-name-and-image'
            title={
                <div className="flex justify-between items-center">
                    <span className='DrawergoBack gap-6 pr-4 pointer'>
                        <IoArrowBack onClick={closeGroupInfoDrawer} />
                    </span>
                    Group info
                </div>
            }
            closable={false}
            onClose={closeGroupInfoDrawer}
            visible={showGroupInfoDrawer}
            placement={'right'}
            width={"30%"}
        >
            {/* Group Image */}
            <div className="groupImageUpload">
                <Image
                    alt="bruce wayne"
                    htmlWidth={250}
                    htmlHeight={250}
                    className="object-cover"
                    src={currSelectedChat?.groupChatImage}
                />
            </div>
            {/* Group Name */}
            <div className="d_groupName bg-white">
                <h3>{currSelectedChat?.chatName}</h3>
            </div>
            {/* No. of total participents in group */}
            <div className="totalParticipants">
                <span>Group - {currSelectedChat?.users.length}  participants</span>
            </div>
            {/* List of actual Participents in roup */}
            <div className="groupParticipentsList mt-3">
                <div className="totalParticipentsinList" style={{ fontSize: "16px" }}>
                    <span>{currSelectedChat?.users.length} participants</span>
                </div>
                {/* if admin then allow him to add participents */}
                {
                    currSelectedChat?.groupAdmin?._id === loggedInUser._id && (
                        <div className="adminAddParticipents" >
                            <div className="userListItem flex" onClick={() => setAddParticipentModal(true)}>
                                <div className="chatImage" style={{ paddingLeft: "0px" }}>
                                    <span className='addParticipent'>
                                        <IoPersonAdd />
                                    </span>
                                </div>
                                <div className="chatDescLatestMsg pr-4">
                                    <div className="chatNameAndTime flex items-center ">
                                        <p className='nameLatestMsg chatName m-0 p-0 text-black text-2xl'>Add Paticipent</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {/* List of participents */}
                {isRemoveUserLoading ? <ChatsLoading /> :
                    <div className="par_list">
                        {currSelectedChat.users
                            .slice(0, 10)
                            .map((user, index) => (
                                <div className="userListItem flex" key={index}>
                                    <div className="chatImage" style={{ paddingLeft: "0px" }}>
                                        <Avatar src={user?.profileImage} size="2xl" />
                                    </div>
                                    <div className="chatDescLatestMsg pr-4"
                                        onMouseOver={removeParticipentFromList}
                                        onMouseOut={() => setremoveParticipent(false)}>
                                        <div className="chatNameAndTime flex items-center ">
                                            <p className='nameLatestMsg chatName m-0 p-0 text-black text-2xl'>{user?.name}
                                            </p>
                                            {currSelectedChat?.groupAdmin?._id === user._id &&
                                                <span className='groupAdminBadge'>
                                                    Group admin
                                                </span>
                                            }
                                        </div>
                                        <div className={"chatDescAndSetting flex items-center"} >
                                            <p className='nameLatestMsg m-0 p-0 text-black text-2xl'>
                                                {user?.email}
                                            </p>
                                            {
                                                currSelectedChat?.groupAdmin?._id === loggedInUser._id && // to show dropdown if the loggedin user is admin of this group
                                                currSelectedChat?.groupAdmin?._id !== user._id && // to not show dropDown infront of group admin
                                                removeParticipent && <div
                                                    className="showDropDownToRemoveParticipent">
                                                    <Dropdown
                                                        overlay={() => removeParticipentDropdown(user)}
                                                        trigger={['click']} >
                                                        <AiOutlineDown />
                                                    </Dropdown>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        {currSelectedChat.users.length > 10 && (
                            <div className="viewAllPaticipents">
                                View all ({currSelectedChat?.users.length - 10} more)
                            </div>
                        )}
                    </div>
                }
            </div>
            {/* Exit Group */}
            <div className="exitGroup">
                <span>
                    <IoMdExit />
                </span>
                <span>Exit Group</span>
            </div>
            <ModelAddParticipent addParticipentModal={addParticipentModal} setAddParticipentModal={setAddParticipentModal} />
        </Drawer>
    )
}

export default DrawerGroupInfo