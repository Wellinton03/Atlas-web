import { Routes, Route } from "react-router-dom";
import Movements from "../pages/Movements/Movements"
import Layout from "../layouts/Layout";

export default function AppRoutes() {
    return (
        <Routes>

            <Route element={<Layout />}>


                <Route
                    path="/movements"
                    element={<Movements />}
                />

            </Route>

        </Routes>
    );
}