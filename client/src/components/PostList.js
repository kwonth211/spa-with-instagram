import React, {useState, useEffect} from 'react'
import Post from "./Post";
import {useAppContext} from "../store";
import {Alert} from 'antd'
import {useAxios, axiosInstance} from "api";

const apiUrl = "/api/posts/"

export default function PostList() {
    const {store: {jwtToken}} = useAppContext()
    const headers = {'Authorization': `JWT ${jwtToken}`}

    const [postList, setPostList] = useState([]);

    const [{data: originPostList, loading, error}, refetch] = useAxios({
        url: apiUrl,
        headers
    })

    useEffect(() => {
        setPostList(originPostList);
    }, [originPostList]);

    const handleLike = async ({post, isLike}) => {
        const apiUrl = `/api/posts/${post.id}/like/`;
        const method = isLike ? "POST" : "DELETE";

        try {
            const response = await axiosInstance({
                url: apiUrl,
                method,
                headers
            })
            setPostList(prevList => {
                return prevList.map(currentPost =>
                    currentPost === post
                        ? {...currentPost, is_like: isLike}
                        : currentPost
                );
            });
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div>
            {postList && postList.length === 0 && <Alert type="warning" message='포스팅이 없습니다.'/>}
            {postList && postList.map(post => <Post post={post} key={post.id} handleLike={handleLike}/>)}
        </div>
    );
}

