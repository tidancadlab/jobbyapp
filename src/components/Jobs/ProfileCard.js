export default ({data}) => (
  <div className="profile">
    <div className="avatar">
      <img src={data.profile_details.profileImageUrl} alt="profile" />
    </div>
    <h1 className="name">{data.profile_details.name}</h1>
    <p className="description">{data.profile_details.shortBio}</p>
  </div>
)
