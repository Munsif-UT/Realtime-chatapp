import React from 'react'
import { Input, FormControl, Button } from "@vechaiui/react"
function RegistrationForm({ showPassword, handleToggleShowPassword, regFormData, regFormErr, handleChangeForBothLoginAndRegForm, submitBothLoginAndRegistrationForm }) {
    return (
        <div className="form-container sign-up-container">
            <form>
                <h1 className='hello-tailwind'>Sign Up</h1>
                <FormControl invalid={regFormErr.name && true}>
                    <Input
                        type="text" name="name" placeholder="Enter your username."
                        value={regFormData.name}
                        onChange={handleChangeForBothLoginAndRegForm} />
                </FormControl>
                <FormControl invalid={regFormErr.email && true}>
                    <Input
                        type="email" name="email" placeholder="jon@gmail.com"
                        value={regFormData.email}
                        onChange={handleChangeForBothLoginAndRegForm}
                    />
                </FormControl>
                <FormControl invalid={regFormErr.password && true}>
                    <Input.Group>
                        <Input
                            className="pr-16"
                            placeholder="Enter password"
                            name='password'
                            type={showPassword ? "text" : "password"}
                            value={regFormData.password}
                            onChange={handleChangeForBothLoginAndRegForm}
                        />
                        <Input.RightElement className="w-16" style={{ top: "7px", right: "7px" }}>
                            <Button type="button" size="xs" variant="solid" onClick={handleToggleShowPassword}>
                                {showPassword ? "Hide" : "Show"}
                            </Button>
                        </Input.RightElement>
                    </Input.Group>
                </FormControl>
                <button onClick={submitBothLoginAndRegistrationForm}>Sign Up</button>
            </form>
        </div>
    )
}

export default RegistrationForm