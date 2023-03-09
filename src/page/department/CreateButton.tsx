import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import * as React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { handleError } from '../../utils';

interface Props {
    reload: () => Promise<any>,
}
const CreateButton: React.FC<Props> = (props) => {
    const [form] = Form.useForm<{ code: string, name: string, description: string }>();

    return <ModalForm<{
        code: string,
        name: string,
        description: string
    }>
        title="新建部门"
        width={400}
        trigger={
            <Button type="primary">
                <PlusOutlined />新建
            </Button>
        }
        form={form}
        autoFocusFirstInput={true}
        modalProps={{ destroyOnClose: true, onCancel: () => { } }}
        submitTimeout={2000}
        onFinish={async (values) => {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            };
            try {
                await axios.post("/api/v1/department/add", {
                    "code": values.code,
                    "name": values.name,
                    "description": values.description
                },
                    config);
                message.success('提交成功');
                await props.reload();
            } catch (error: any) {
                handleError(error);
                return false;
            }

            return true;
        }}
    >
        <ProFormText
            width="lg"
            name="code"
            label="部门编号"
            rules={[{ required: true, message: '请输入部门编号!' }]}
            placeholder="请输入部门编号" />

        <ProFormText
            width="lg"
            name="name"
            label="部门名称"
            placeholder="请输入部门名称"
            rules={[{ required: true, message: '请输入部门名称!' }]} />

        <ProFormText
            width="lg"
            name="description"
            label="部门描述"
            placeholder="请输入部门描述" />
    </ModalForm>
}

export default CreateButton;