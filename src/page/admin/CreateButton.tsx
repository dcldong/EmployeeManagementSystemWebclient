import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import * as React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import md5 from 'js-md5';
import { handleError } from '../../utils';

interface Props {
    reload: () => Promise<any>,
}
const CreateButton: React.FC<Props> = (props) => {
    const [form] = Form.useForm<{ userName: string, password: string, remark: string }>();

    return <ModalForm<{
        userName: string,
        password: string,
        remark: string
    }>
        title="新增管理员"
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
                await axios.post("/api/v1/user/add", {
                    "userName": values.userName,
                    "password": md5(values.password),
                    "remark": values.remark
                }, config);
                message.success('提交成功');
                await props.reload();
                return true;
            } catch (error: any) {
                handleError(error);
                return false;
            }
        }}
    >
        <ProFormText
            width="lg"
            name="userName"
            label="用户名"
            required={true}
            rules={[{ required: true, message: '请输入用户名!' }]}
            placeholder="请输入用户名" />
        <ProFormText.Password
            width="lg"
            name="password"
            label="密码"
            required={true}
            rules={[{ required: true, message: '请输入密码!' }]}
            placeholder="请输入密码" />
        <ProFormText
            width="lg"
            name="remark"
            label="备注信息"
            placeholder="请输入备注信息" />
    </ModalForm>
}

export default CreateButton;