import "./Navigation.css";

const Navigation = () => {
    return (
        <div className="navigation">
            <nav>
                <ul className="primary-navigation underline-indicators flex">
                    <li className="active"><a className="uppercase text-red letter-spacing-2" href="#">The Story</a></li>
                    <li><a className="uppercase text-red letter-spacing-2" href="#">Classes</a></li>
                    <li><a className="uppercase text-red letter-spacing-2" href="#">Camps</a></li>
                    <li><a className="uppercase text-red letter-spacing-2" href="#">Gallery</a></li>
                </ul>
            </nav>
        </div>
    )
}

export default Navigation;