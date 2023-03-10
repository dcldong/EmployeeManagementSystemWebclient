import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import * as React from 'react';
import DetailLayout from '../../layout/DetailLayout';
import CreateButton from './CreateButton';
import ViewButton from './ViewButton';
import axios from 'axios';
import { handleError } from '../../utils';

interface Props {
}
const AdminPage: React.FC<Props> = (props) => {
    const actionRef = React.useRef<ActionType>();

    type AdminItem = {
        id: number,
        userName: string,
        password: string,
        permission: number,
        remark: string
    }

    const columns: ProColumns<AdminItem>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            hideInSearch: true
        },
        {
            title: '备注信息',
            dataIndex: 'remark',
            hideInSearch: true
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <ViewButton record={record} action="editUserName" reload={actionRef.current!.reload} />,
                <ViewButton record={record} action="resetPassword" reload={actionRef.current!.reload} />,
                <a key="delete" hidden={record.permission == 1} onClick={async () => {
                    const config = {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    };
                    await axios.post("api/v1/user/delete", { "ids": [record.id] }, config);
                    action?.reload();
                }}>删除</a>
            ]
        }
    ]

    return <DetailLayout>
        <ProTable<AdminItem>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            editable={{
                type: 'multiple',
            }}
            request={async (params = {}, sort, filter) => {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                };
                try {
                    const result = await axios.get("/api/v1/users", config);
                    console.log(result.data);
                    return Promise.resolve(result.data);
                } catch (error: any) {
                    handleError(error);
                }
            }}
            rowKey="id"
            search={false}
            options={{ setting: { listsHeight: 400 } }}
            pagination={false}
            headerTitle="管理员管理"
            toolBarRender={() => [
                <CreateButton reload={actionRef.current!.reload} />
            ]}
        />
    </DetailLayout>;
}

export default AdminPage;