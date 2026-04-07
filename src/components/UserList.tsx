import { UserInfo } from '../types';

interface Props {
  users: UserInfo[];
}

export default function UserList({ users }: Props) {
  return (
    <div className="user-list">
      <div className="user-list-header">Users</div>
      {users.map((user) => (
        <div key={user.id} className="user-list-item">
          <img
            className="user-list-avatar"
            src={user.avatarUrl}
            alt={user.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/avatars/user.svg';
            }}
          />
          <div className="user-list-info">
            <div
              className="user-list-name"
              style={{ color: user.nameColor }}
            >
              {user.name}
            </div>
            <div className="user-list-status">{user.status}</div>
          </div>
          <div className={`status-dot ${user.status}`} />
        </div>
      ))}
    </div>
  );
}
