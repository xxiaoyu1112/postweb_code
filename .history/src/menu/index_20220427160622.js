import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath(menu) {
    return menu.map(e => ({
        ...e,
        path: e.path || uniqueId('d2-menu-empty-'),
        ...e.children ? {
            children: supplementPath(e.children)
        } : {}
    }))
}

export const menuHeader = supplementPath([
    { path: '/index', title: '首页', icon: 'home' },
    {
        title: '模型管理模块',
        icon: 'folder-o',
        children: [
            { path: '/model_list', title: '模型列表' },
        ]
    },
    {
        title: '揽件预测模块',
        icon: 'folder-o',
        children: [
            { path: '/predict', title: '揽件顺序预测' },
            { path: '/courier_predict', title: '快递员揽件预测' },
        ]
    },
    {
        title: '数据管理',
        icon: 'folder-o',
        children: [
            { path: '/raw_data', title: '原始数据管理' },
        ]
    },
    {
        title: '页面',
        icon: 'folder-o',
        children: [
            { path: '/page1', title: '页面 1' },
            { path: '/page2', title: '页面 2' },
            { path: '/page3', title: '页面 3' }
        ]
    }
])

export const menuAside = supplementPath([
    { path: '/index', title: '首页', icon: 'home' },
    {
        title: '模型管理模块',
        icon: 'folder-o',
        children: [
            { path: '/model_list', title: '模型列表' },
        ]
    },
    // {
    //     title: '页面',
    //     icon: 'folder-o',
    //     children: [
    //         { path: '/manage', title: '页面 1' },
    //         { path: '/page2', title: '页面 2' },
    //         { path: '/page3', title: '页面 3' }
    //     ]
    // },
    {
        title: '揽件预测模块',
        icon: 'folder-o',
        children: [
            { path: '/predict', title: '揽件顺序预测' },
            { path: '/courier_predict', title: '快递员揽件预测' },
        ]
    },
    {
        title: '数据管理',
        icon: 'folder-o',
        children: [
            { path: '/raw_data', title: '原始数据' },
        ]
    }
])
