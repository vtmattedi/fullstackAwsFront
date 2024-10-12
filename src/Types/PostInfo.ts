class PostInfo {
    title: string | undefined;
    content: string | undefined;
    created_at: string | undefined;
    postid: number | undefined;
    user_id:number | undefined;
    constructor( {title, content, created_at, postid, user_id}: {title?: string | undefined, content?: string | undefined, created_at?: string | undefined, postid?: number | undefined, user_id?:number | undefined} )
    {
        this.title = title;
        this.content = content;
        this.created_at = created_at;
        this.postid = postid;
        this.user_id = user_id; 
    }
}
export default PostInfo;