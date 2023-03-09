import { ModalForm, ProForm, ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import * as React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { handleError } from '../../utils';

interface Props {
    reload: () => Promise<any>,
}

type EmployeeItem = {
    id: number,
    code: string,
    name: string,
    sex: string,
    departmentId: number,
    departmentName: string,
    position: string,
    entryTime: string,
    phoneNumber: string,
    idNumber: string,
    birthday: string,
    address: string,
    remark: string
}
type DepartmentItem = {
    id: number,
    code: string,
    name: string,
    description: string
}
const CreateButton: React.FC<Props> = (props) => {
    const [form] = Form.useForm<EmployeeItem>();

    return <ModalForm<EmployeeItem>
        title="新建用户"
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
                await axios.post("/api/v1/employee/add", {
                    id: values.id,
                    code: values.code,
                    name: values.name,
                    sex: values.sex,
                    departmentId: values.departmentId,
                    departmentName: values.departmentName,
                    position: values.position,
                    entryTime: formatDate(values.entryTime),
                    birthday: formatDate(values.birthday),
                    idNumber: values.idNumber,
                    phoneNumber: values.phoneNumber,
                    address: values.address,
                    remark: values.remark,
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
        <ProForm.Group>
            <ProFormText
                width="lg"
                name="code"
                label="员工编号"
                rules={[{ required: true, message: '请输入6位数字!' }, {
                    pattern: /^\d{6}$/, message: '请输入6位数字!'
                }]}
                placeholder="请输入6位数字员工编号" />
            <ProFormText
                width="lg"
                name="name"
                label="员工姓名"
                rules={[{ required: true, message: '请输入员工姓名!' }]}
                placeholder="请输入员工姓名" />
            <ProFormSelect
                width="md"
                name="sex"
                label="性别"
                rules={[{ required: true, message: '请选择性别!' }]}
                options={[{ label: "男", value: '男' }, { label: "女", value: '女' }]}
            />
        </ProForm.Group>
        <ProForm.Group>
            <ProFormSelect
                width="md"
                name="departmentId"
                label="部门"
                rules={[{ required: true, message: '请选择部门!' }]}
                request={async (data) => {
                    const config = {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    };

                    return axios.get("/api/v1/departments", config).then(result => {
                        return result.data.data.map((item: DepartmentItem) => {
                            return {
                                "label": item.name,
                                "value": item.id
                            }
                        });
                    });
                }}
            />
            <ProFormText
                width="lg"
                name="position"
                label="职位"
                rules={[{ required: true, message: '请选择职位！' }]}
                placeholder="请输入职位" />
            <ProFormDatePicker
                label="入职时间"
                name="entryTime"
            />
        </ProForm.Group>
        <ProFormText
            width="lg"
            name="phoneNumber"
            rules={[{ required: true, message: '请输入手机号!' },
            { pattern: new RegExp('^[1][3,4,5,6,7,8,9][0-9]{9}$'), message: '请输入正确格式的手机号' }]}
            label="手机号"
        />
        <ProFormText
            width="lg"
            name="idNumber"
            rules={[{ required: true, message: '请输入身份证号码!' }, {
                pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
                , message: '请输入正确的身份证号码'
            }]}
            label="身份证号码"
        />
        <ProFormDatePicker
            label="出生日期"
            rules={[{ required: true, message: '请选择出生日期!' }]}
            name="birthday"
        />
        <ProFormText
            width="lg"
            name="address"
            rules={[{ required: true, message: '请输入地址信息!' }]}
            label="地址"
        />
        <ProFormText
            width="lg"
            name="remark"
            label="备注信息"
        />
    </ModalForm>
}

function formatDate(time: any) {
    var date = new Date(time);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    return YY + MM + DD;
}

export default CreateButton;