import { ModalForm, ProForm, ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import * as React from 'react';
import axios from 'axios';
import { handleError } from '../../utils';

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

interface Props {
    reload: () => Promise<any>,
    record: EmployeeItem,
    action: string
}

type DepartmentItem = {
    id: number,
    code: string,
    name: string,
    description: string
}

const ViewButton: React.FC<Props> = (props) => {
    const [form] = Form.useForm<EmployeeItem>();

    return <ModalForm<EmployeeItem>
        layout={props.action == "view" ? "horizontal" : "vertical"}
        title={props.action == "view" ? "查看员工信息" : "编辑员工信息"}
        width={500}
        trigger={
            <a rel="noopener noreferrer" key="view">
                {props.action == "view" ? "查看" : "编辑"}
            </a>
        }
        form={form}
        autoFocusFirstInput={true}
        modalProps={{ destroyOnClose: true, onCancel: () => { } }}
        submitTimeout={2000}
        submitter={{   //隐藏取消按钮
            resetButtonProps: {
                style: {
                    display: 'none',
                },
            },
        }}

        onFinish={async (values) => {
            if (props.action == "edit") {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                };
                try {
                    await axios.post("/api/v1/employee/update", {
                        id: props.record.id,
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
                } catch (error: any) {
                    handleError(error);
                    return false;
                }

                await props.reload();
            }
            return true;
        }}
    >

        <ProForm.Group>
            <ProFormText
                width="lg"
                name="code"
                label="员工编号"
                initialValue={props.record.code}
                rules={[{ required: true, message: '请输入6位数字!' },
                { pattern: /^\d{6}$/, message: '请输入6位数字' }]}
                readonly={props.action == "view" && true}
                placeholder="请输入6位数字员工编号" />
            <ProFormText
                width="lg"
                name="name"
                label="员工姓名"
                initialValue={props.record.name}
                rules={[{ required: true, message: '请输入员工姓名!' }]}
                readonly={props.action == "view" && true}
                placeholder="请输入员工姓名" />
            <ProFormSelect
                width="md"
                name="sex"
                label="性别"
                initialValue={props.record.sex}
                rules={[{ required: true, message: '请选择性别!' }]}
                options={[{ label: "男", value: '男' }, { label: "女", value: '女' }]}
                readonly={props.action == "view" && true}
            />
        </ProForm.Group>
        <ProForm.Group>
            <ProFormSelect
                width="md"
                name="departmentId"
                label="部门"
                rules={[{ required: true, message: '请选择部门!' }]}
                initialValue={props.record.departmentId}
                readonly={props.action == "view" && true}
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
                    }).catch(error => handleError(error));
                }}
            />
            <ProFormText
                width="lg"
                name="position"
                label="职位"
                initialValue={props.record.position}
                rules={[{ required: true, message: '请输入职位!' }]}
                readonly={props.action == "view" && true}
                placeholder="请输入职位" />
            <ProFormDatePicker
                label="入职时间"
                name="entryTime"
                initialValue={props.record.entryTime}
                readonly={props.action == "view" && true}
            />
        </ProForm.Group>
        <ProForm.Group>
            <ProFormText
                width="lg"
                name="phoneNumber"
                label="手机号"
                rules={[{ required: true, message: '请输入手机号!' },
                { pattern: new RegExp('^[1][3,4,5,6,7,8,9][0-9]{9}$'), message: '请输入正确格式的手机号' }]}
                readonly={props.action == "view" && true}
                initialValue={props.record.phoneNumber}
            />
            <ProFormText
                width="lg"
                name="idNumber"
                label="身份证号码"
                rules={[{ required: true, message: '请输入身份证号码!' },
                {
                    pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
                    , message: '请输入正确的身份证号码'
                }]}
                readonly={props.action == "view" && true}
                initialValue={props.record.idNumber}
            />
            <ProFormDatePicker
                label="出生日期"
                name="birthday"
                rules={[{ required: true, message: '请输入出生日期!' }]}
                initialValue={props.record.birthday}
                readonly={props.action == "view" && true}
            />
        </ProForm.Group>
        <ProFormText
            width="lg"
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入地址!' }]}
            readonly={props.action == "view" && true}
            initialValue={props.record.address}
        />
        <ProFormText
            width="lg"
            name="remark"
            label="备注信息"
            readonly={props.action == "view" && true}
            initialValue={props.record.remark}
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

export default ViewButton;