"use client";
import { Component, ReactNode, } from "react";
import ErrorPage from "./ErrorPage";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }


export default class ErrorBoundary extends Component<Props, State> {

    state = { hasError: false, };
    static getDerivedStateFromError() {
        return { hasError: true, };
    }

    render() {
        if (this.state.hasError) {
            return (<ErrorPage onRetry={() => { window.location.reload(); }} />);
        }
        return this.props.children;
    }
}
