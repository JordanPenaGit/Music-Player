// import React from 'react';
import { Sidebar, SidebarItem } from 'react-responsive-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

export default function SimpleList() {
  const items = [
    <SidebarItem background="rgb(121, 22, 190)"> My Music App </SidebarItem>,
    <SidebarItem background="rgb(121, 22, 240)"> Playlist A</SidebarItem>,
    <SidebarItem> Billie Jean </SidebarItem>,
    <SidebarItem> Waka Waka </SidebarItem>,
    <SidebarItem> Dynamite </SidebarItem>,
    <SidebarItem> P!NK </SidebarItem>,
    <SidebarItem> Goof Life </SidebarItem>,
    <SidebarItem> On Top of the World </SidebarItem>,
  ];

  return (
    <Sidebar
      breakpoint={980}
      content={items}
      background="rgb(51, 50, 50)"
      hoverHighlight="rgba(134, 176, 201, 0.534)"
    />
  );
}
