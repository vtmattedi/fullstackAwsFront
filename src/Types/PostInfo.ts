class PostInfo {
    title: string | undefined;
    content: string | undefined;
    created_at: string | undefined;
    id: number | undefined;
    user_id:number | undefined;
    username: string | undefined;
    constructor( {title, content, created_at, id, user_id, username}: {title?: string | undefined, content?: string | undefined, created_at?: string | undefined, id?: number | undefined, user_id?:number | undefined, username?: string | undefined} )
    {
        this.title = title;
        this.content = content;
        this.created_at = created_at;
        this.id = id;
        this.user_id = user_id; 
        this.username = username;
    }
}
export default PostInfo;